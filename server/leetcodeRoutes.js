import { Router } from "express";
import { fail } from "./errors.js";
import { getLeetCodeSummary } from "./leetcodeService.js";

export const leetcodeRoutes = Router();

leetcodeRoutes.get("/summary", async (req, res, next) => {
  try {
    const username = String(req.query.username).trim();
    const difficulty = String(req.query.difficulty).trim().toUpperCase();
    if (username.length === 0) fail("Username is required", 400);

    res.json(await getLeetCodeSummary(username, difficulty));
  } catch (err) {
    next(err);
  }
});
