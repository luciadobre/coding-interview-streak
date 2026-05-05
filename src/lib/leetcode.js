import { setCookie } from "./cookies.js";

export const emptyProblem = {
  title: "Load a user to unlock this slot.",
  difficulty: "LeetCode",
  url: "",
  date: "",
  topicTags: [],
};

export const emptySummary = {
  username: "",
  totalSolved: "--",
  streak: "0",
  totalActiveDays: "--",
  easySolved: "--",
  mediumSolved: "--",
  hardSolved: "--",
  submissionCalendar: {},
  startProblem: emptyProblem,
  recapProblem: emptyProblem,
};

const problem = (data) => ({
  title: data.title,
  difficulty: data.difficulty,
  url: data.url,
  date: data.date,
  topicTags: data.topicTags,
});

export async function getSummary(username, difficulty) {
  const params = new URLSearchParams({ username, difficulty });

  const res = await fetch(`/api/leetcode/summary?${params}`);
  const text = await res.text();
  if (text.length === 0)
    throw new Error("API returned no response. Is the local server running?");
  const data = JSON.parse(text);

  if (!res.ok) throw new Error(data.error);

  const summary = {
    username,
    totalSolved: data.totalSolved,
    streak: data.streak,
    totalActiveDays: data.totalActiveDays,
    easySolved: data.easySolved,
    mediumSolved: data.mediumSolved,
    hardSolved: data.hardSolved,
    submissionCalendar: data.submissionCalendar,
    startProblem: problem(data.startProblem),
    recapProblem: problem(data.recapProblem),
  };

  setCookie("lc_username", username);
  setCookie("lc_difficulty", difficulty);
  setCookie("lc_streak", summary.streak);
  return summary;
}
