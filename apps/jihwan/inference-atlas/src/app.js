import express from "express";
import { accessSync, constants, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function createApp(directory = fileURLToPath(new URL("../dist/", import.meta.url))) {
  const root = resolve(directory);
  const index = resolve(root, "index.html");
  accessSync(index, constants.R_OK);
  const info = statSync(index);
  if (!info.isFile() || info.size === 0) {
    throw new Error("Static bundle index must be a nonempty file");
  }
  const app = express();
  app.disable("x-powered-by");
  app.get("/health", (_request, response) => response.json({ status: "ready" }));
  // Atlas uses HashRouter: only real files are served; unknown paths stay 404.
  app.use(express.static(root, { index: "index.html", dotfiles: "deny", redirect: false, fallthrough: false }));
  app.use((error, _request, response, _next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500;
    response.status(status).json({ error: status === 404 ? "not_found" : "request_failed" });
  });
  return app;
}
