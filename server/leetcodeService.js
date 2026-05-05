import { config } from "./config.js";
import { fail } from "./errors.js";

const DAY = 86_400_000;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

async function json(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) fail(`Upstream returned ${res.status}`, res.status);
  return res.json();
}

function normalizeSubmission(submission) {
  const timestamp = Number(submission.timestamp);

  return {
    title: submission.title,
    titleSlug: submission.titleSlug,
    timestamp,
    date: new Date(timestamp * 1000).toLocaleDateString("en-US"),
    url: `https://leetcode.com/problems/${submission.titleSlug}/`,
  };
}

function normalizeProblem(problem) {
  return {
    title: problem.title,
    titleSlug: problem.titleSlug,
    difficulty: problem.difficulty,
    url: `https://leetcode.com/problems/${problem.titleSlug}/`,
    date: "",
    topicTags: problem.topicTags.map((t) => ({ name: t.name, slug: t.slug })),
  };
}

function normalizeDailyProblem(daily) {
  return {
    title: daily.questionTitle,
    titleSlug: daily.titleSlug,
    difficulty: daily.difficulty,
    url: daily.questionLink,
    date: daily.date,
    topicTags: daily.topicTags.map((t) => ({ name: t.name, slug: t.slug })),
  };
}

function recapDifficulties(difficulty) {
  return {
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
  const today = new Date();
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
    `${config.alfaApiBase}/problems?difficulty=${difficulty}&limit=3000`,
  );
  return problems.problemsetQuestionList.map(normalizeProblem);
}

async function getProblemMap(difficulties) {
  const problemLists = await Promise.all(difficulties.map(getProblems));
  return new Map(
    problemLists.flat().map((problem) => [problem.titleSlug, problem]),
  );
}

function getUnsolvedProblem(difficulty, problemList, solvedTitles) {
  const problem = problemList.find((item) => !solvedTitles.has(item.titleSlug));
  if (problem === undefined) {
    fail(`No unsolved ${difficulty.toLowerCase()} problem found`, 404);
  }
  return problem;
}

function getRecapProblem(recentAccepted, difficulty, problemMap) {
  const allowed = recapDifficulties(difficulty);
  const submission = recentAccepted.find((item) => {
    const problem = problemMap.get(item.titleSlug);
    return problem && allowed.includes(problem.difficulty.toUpperCase());
  });

  if (submission === undefined) {
    fail(`No recent ${allowed.join("/").toLowerCase()} solve found`, 404);
  }

  const problem = problemMap.get(submission.titleSlug);
  return {
    ...submission,
    difficulty: problem.difficulty,
    topicTags: problem.topicTags,
  };
}

export async function getLeetCodeSummary(username, difficulty) {
  const [stats, daily, accepted] = await Promise.all([
    json(`${config.statsApiBase}/${encodeURIComponent(username)}`),
    json(`${config.alfaApiBase}/daily`),
    json(
      `${config.alfaApiBase}/${encodeURIComponent(username)}/acSubmission?limit=20`,
    ),
  ]);

  if (stats.status === "error") fail(stats.message, 404);

  const recentAccepted = accepted.submission
    .map(normalizeSubmission)
    .sort((a, b) => a.timestamp - b.timestamp);
  const solvedTitles = new Set(recentAccepted.map((item) => item.titleSlug));
  const problemMap = await getProblemMap(
    difficulty === "ANY" ? DIFFICULTIES : recapDifficulties(difficulty),
  );

  const startProblem =
    difficulty === "ANY"
      ? normalizeDailyProblem(daily)
      : getUnsolvedProblem(difficulty, [...problemMap.values()], solvedTitles);

  return {
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
  };
}
