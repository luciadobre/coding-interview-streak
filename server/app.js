import express from "express";
import path from "node:path";
import { distDir } from "./config.js";
import { errorHandler } from "./errors.js";
import { leetcodeRoutes } from "./leetcodeRoutes.js";

export function createApp() {
  const app = express();

  app.use("/api/leetcode", leetcodeRoutes);
  app.use(errorHandler);
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });

  return app;
}
