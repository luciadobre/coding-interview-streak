import { getCookie, setCookie } from "./cookies.js";

const DAY = 86_400_000;

const today = () => new Date().toISOString().slice(0, 10);

export function getAppStreak() {
  const days = new Set(getCookie("app_done_days").split(",").filter(Boolean));
  let cursor = Date.parse(today());
  let count = 0;

  while (days.has(new Date(cursor).toISOString().slice(0, 10))) {
    count += 1;
    cursor -= DAY;
  }

  return count;
}

export function markAppDone() {
  const days = new Set(getCookie("app_done_days").split(",").filter(Boolean));
  days.add(today());
  setCookie("app_done_days", [...days].join(","));
  setCookie("app_streak", getAppStreak());
  return getAppStreak();
}

export function getDoneProblems() {
  return new Set(getCookie("app_done_problems").split(",").filter(Boolean));
}

export function markProblemDone(url) {
  const done = getDoneProblems();
  done.add(url);
  setCookie("app_done_problems", [...done].join(","));
  return done;
}
