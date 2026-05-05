import { getCookie, setCookie } from "./cookies.js";

const DONE_DAYS_KEY = "app_done_days";
const DONE_PROBLEMS_KEY = "app_done_problems";

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = () => dateKey(new Date());

const previousDay = (date) => {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return previous;
};

const readCsvSet = (key) => new Set(getCookie(key).split(",").filter(Boolean));

export function getAppStreak() {
  const days = readCsvSet(DONE_DAYS_KEY);
  let cursor = new Date();
  let count = 0;

  while (days.has(dateKey(cursor))) {
    count += 1;
    cursor = previousDay(cursor);
  }

  return count;
}

export function markAppDone() {
  const days = readCsvSet(DONE_DAYS_KEY);
  days.add(today());
  setCookie(DONE_DAYS_KEY, [...days].join(","));
  return getAppStreak();
}

export function getDoneProblems() {
  return readCsvSet(DONE_PROBLEMS_KEY);
}

export function markProblemDone(url) {
  const done = getDoneProblems();
  done.add(url);
  setCookie(DONE_PROBLEMS_KEY, [...done].join(","));
  return done;
}
