import assert from "node:assert/strict";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, rm, readFile, readdir } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createApp } from "./app.js";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "atlas-static-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = join(root, "dist");
  await mkdir(join(dist, "assets"), { recursive: true });
  await writeFile(join(dist, "index.html"), '<!doctype html><html><head><link rel="stylesheet" href="./assets/app.css"></head><body><div id="root">Atlas fixture</div></body></html>');
  await writeFile(join(dist, "assets/app.css"), "body { color: navy; }");
  await writeFile(join(dist, ".env"), "private fixture data");
  await writeFile(join(root, "outside.txt"), "outside fixture data");
  const server = createApp(dist).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  return server.address().port;
}

function request(port, path, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method }, response => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", chunk => { body += chunk; });
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("health is ready when a readable static bundle is installed", async t => {
  const response = await request(await fixture(t), "/health");
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), { status: "ready" });
  assert.equal(response.headers["x-powered-by"], undefined);
});

test("index and CSS are served over HTTP and HEAD has no body", async t => {
  const port = await fixture(t);
  const index = await request(port, "/");
  assert.equal(index.status, 200);
  assert.match(index.headers["content-type"], /text\/html/);
  assert.match(index.body, /Atlas fixture/);
  const css = await request(port, "/assets/app.css");
  assert.equal(css.status, 200);
  assert.match(css.headers["content-type"], /text\/css/);
  assert.equal(css.body, "body { color: navy; }");
  const head = await request(port, "/", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
});

test("unknown files, dotfiles and raw traversal requests do not expose files or become SPA success", async t => {
  const port = await fixture(t);
  for (const path of ["/missing", "/assets/missing.css", "/.env", "/../outside.txt", "/%2e%2e/outside.txt", "/assets/%2e%2e/%2e%2e/outside.txt"]) {
    const response = await request(port, path);
    assert.ok([403, 404].includes(response.status), `${path}: ${response.status}`);
    assert.doesNotMatch(response.body, /private fixture data|outside fixture data|Atlas fixture/);
    assert.doesNotMatch(response.body, /atlas-static-test-/);
  }
});

test("a missing bundle cannot start a healthy server", async t => {
  const root = await mkdtemp(join(tmpdir(), "atlas-static-empty-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  assert.throws(() => createApp(root));
  await writeFile(join(root, "index.html"), "");
  assert.throws(() => createApp(root), /nonempty file/);
});

test("installed bundle files exactly match the passed upstream receipt and provenance", async () => {
  const root = new URL("../", import.meta.url);
  const provenance = JSON.parse(await readFile(new URL("provenance.json", root), "utf8"));
  const receipt = JSON.parse(await readFile(new URL("upstream-quality.json", root), "utf8"));
  assert.equal(receipt.status, "passed");
  assert.equal(receipt.completed, true);
  assert.equal(receipt.source_revision, provenance.source_revision);
  assert.equal(provenance.quality_run, `${provenance.source_repo}/actions/runs/${receipt.run_id}`);
  const bundle = receipt.checks.filter(check => check.name === "frontend-verified-bundle");
  assert.equal(bundle.length, 1);
  assert.equal(bundle[0].status, "passed");
  assert.deepEqual(provenance.bundle_files, bundle[0].details.files);
  const actual = {};
  async function collect(directory, prefix = "") {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name;
      const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      assert.equal(entry.isSymbolicLink(), false);
      if (entry.isDirectory()) await collect(path, name + "/");
      else {
        assert.equal(entry.isFile(), true);
        actual[name] = createHash("sha256").update(await readFile(path)).digest("hex");
      }
    }
  }
  await collect(new URL("dist/", root));
  assert.deepEqual(actual, provenance.bundle_files);
});
