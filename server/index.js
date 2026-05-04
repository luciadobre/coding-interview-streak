import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = path.join(rootDir, "dist");
const config = {
  port: process.env.PORT || 3001,
  stats: process.env.STATS_API_BASE || "https://leetcode-stats.tashif.codes",
  alfa: process.env.ALFA_API_BASE || "https://alfa-leetcode-api.onrender.com",
};
const DAY = 86_400_000;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

function fail(message, status = 502) {
  throw Object.assign(new Error(message), { status });
}

async function json(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) fail(`Upstream returned ${res.status}`, res.status);
  return res.json();
}

function requireValue(value, label, type) {
  const number = Number(value);
  const valid = {
    array: Array.isArray(value),
    object: value !== null && typeof value === "object" && !Array.isArray(value),
    string: typeof value === "string" && value.trim().length > 0,
    number: Number.isFinite(number),
  }[type];

  if (!valid) fail(`${label} must be a ${type}`);
  return type === "number" ? number : value;
}

function normalizeSubmission(submission) {
  const item = requireValue(submission, "Accepted submission", "object");
  const titleSlug = requireValue(
    item.titleSlug,
    "Accepted submission.titleSlug",
    "string",
  );
  const timestamp = requireValue(
    item.timestamp,
    "Accepted submission.timestamp",
    "number",
  );

  return {
    title: requireValue(item.title, "Accepted submission.title", "string"),
    titleSlug,
    timestamp,
    date: new Date(timestamp * 1000).toLocaleDateString("en-US"),
    url: `https://leetcode.com/problems/${titleSlug}/`,
  };
}

function normalizeProblem(problem) {
  const item = requireValue(problem, "Problem", "object");
  const titleSlug = requireValue(item.titleSlug, "Problem.titleSlug", "string");

  return {
    title: requireValue(item.title, "Problem.title", "string"),
    titleSlug,
    difficulty: requireValue(item.difficulty, "Problem.difficulty", "string"),
    url: `https://leetcode.com/problems/${titleSlug}/`,
    date: "",
  };
}

function withDifficulty(submission, problem) {
  return {
    ...submission,
    difficulty: problem.difficulty,
  };
}

function recapDifficulties(difficulty) {
  return {
    ANY: DIFFICULTIES,
    EASY: ["EASY"],
    MEDIUM: ["MEDIUM", "EASY"],
    HARD: ["HARD", "MEDIUM", "EASY"],
  }[difficulty];
}

function streak(calendar) {
  const days = new Set(
    Object.entries(calendar)
      .filter(([, n]) => Number(n) > 0)
      .map(([ts]) => {
        const d = new Date(Number(ts) * 1000);
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }),
  );
  let today = new Date();
  let cursor = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor -= DAY;
  }
  return count;
}

async function getProblems(difficulty) {
  const problems = await json(
    `${config.alfa}/problems?difficulty=${difficulty}&limit=3000`,
  );
  return requireValue(
    problems.problemsetQuestionList,
    "Problem list",
    "array",
  ).map(normalizeProblem);
}

async function getProblemMap(difficulties) {
  const problemLists = await Promise.all(difficulties.map(getProblems));
  return new Map(
    problemLists.flat().map((problem) => [problem.titleSlug, problem]),
  );
}

function getUnsolvedProblem(difficulty, problemList, solvedTitles) {
  const problem = problemList.find((p) => !solvedTitles.has(p.titleSlug));
  if (problem === undefined) {
    fail(`No unsolved ${difficulty.toLowerCase()} problem found`, 404);
  }
  return problem;
}

function getRecapProblem(recentAccepted, difficulty, problemMap) {
  const allowed = recapDifficulties(difficulty);
  const submission = recentAccepted.find((item) => {
    const problem = problemMap.get(item.titleSlug);
    return problem !== undefined && allowed.includes(problem.difficulty.toUpperCase());
  });

  if (submission === undefined) {
    fail(`No recent ${allowed.join("/").toLowerCase()} solve found`, 404);
  }

  const problem = problemMap.get(submission.titleSlug);
  if (problem === undefined) {
    fail(`No problem metadata found for ${submission.titleSlug}`);
  }
  return withDifficulty(submission, problem);
}

app.get("/api/leetcode/summary", async (req, res, next) => {
  try {
    const username = String(req.query.username).trim();
    const difficulty = String(req.query.difficulty).trim().toUpperCase();
    if (username.length === 0) fail("Username is required", 400);

    const [stats, daily, accepted] = await Promise.all([
      json(`${config.stats}/${encodeURIComponent(username)}`),
      json(`${config.alfa}/daily`),
      json(
        `${config.alfa}/${encodeURIComponent(username)}/acSubmission?limit=20`,
      ),
    ]);
    if (stats.status === "error") fail(stats.message, 404);

    const submissions = requireValue(
      accepted.submission,
      "Accepted submissions",
      "array",
    );
    const recentAccepted = submissions
      .map(normalizeSubmission)
      .sort((a, b) => a.timestamp - b.timestamp);

    const solvedTitles = new Set(recentAccepted.map((s) => s.titleSlug));
    const problemMap =
      difficulty === "ANY"
        ? await getProblemMap(DIFFICULTIES)
        : await getProblemMap(recapDifficulties(difficulty));

    const startProblem =
      difficulty === "ANY"
        ? {
            title: requireValue(
              daily.questionTitle,
              "Daily API response.questionTitle",
              "string",
            ),
            titleSlug: requireValue(
              daily.titleSlug,
              "Daily API response.titleSlug",
              "string",
            ),
            difficulty: requireValue(
              daily.difficulty,
              "Daily API response.difficulty",
              "string",
            ),
            url: requireValue(
              daily.questionLink,
              "Daily API response.questionLink",
              "string",
            ),
            date: requireValue(daily.date, "Daily API response.date", "string"),
          }
        : getUnsolvedProblem(
            difficulty,
            [...problemMap.values()],
            solvedTitles,
          );

    res.json({
      username,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      acceptanceRate: stats.acceptanceRate,
      ranking: stats.ranking,
      submissionCalendar: stats.submissionCalendar,
      streak: streak(stats.submissionCalendar),
      totalActiveDays: Object.values(stats.submissionCalendar).filter(
        (n) => Number(n) > 0,
      ).length,
      startProblem,
      recapProblem: getRecapProblem(recentAccepted, difficulty, problemMap),
      recentAccepted,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ error: err.message });
});

app.use(express.static(distDir));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(config.port, () =>
  console.log(`LeetCode proxy listening on http://localhost:${config.port}`),
);
