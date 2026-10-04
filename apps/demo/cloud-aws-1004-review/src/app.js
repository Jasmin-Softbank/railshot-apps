import express from "express";

export function message() {
  return "ready";
}

export const app = express();
app.get("/health", (_request, response) => response.json({ status: message() }));

app.get("/", (_request, response) => response.json({ application: "cloud-aws-1004-review", version: "review-start", provider: "aws" }));
