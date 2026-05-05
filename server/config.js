import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const distDir = path.join(rootDir, "dist");

export const config = {
  port: process.env.PORT || 3001,
  statsApiBase: process.env.STATS_API_BASE || "https://leetcode-stats.tashif.codes",
  alfaApiBase: process.env.ALFA_API_BASE || "https://alfa-leetcode-api.onrender.com",
};
