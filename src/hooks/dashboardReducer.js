import { getCookie } from "../lib/cookies.js";
import { getAppStreak, getDoneProblems } from "../lib/appStreak.js";
import { emptySummary } from "../lib/leetcode.js";

export const DIFFICULTIES = ["Any", "Easy", "Medium", "Hard"];

export const getDefaultSummary = () => ({
  ...emptySummary,
  streak: getCookie("lc_streak", "0"),
});

export function createDashboardState() {
  return {
    username: getCookie("lc_username"),
    difficulty: getCookie("lc_difficulty", "Any"),
    summary: getDefaultSummary(),
    status: "",
    loading: false,
    done: getDoneProblems(),
    appStreak: getAppStreak(),
  };
}

export function dashboardReducer(state, action) {
  switch (action.type) {
    case "fieldChanged": {
      return { ...state, [action.field]: action.value };
    }
    case "summaryRequested": {
      return { ...state, loading: true, status: "" };
    }
    case "summaryLoaded": {
      return { ...state, ...action.payload, loading: false };
    }
    case "problemCompleted": {
      return {
        ...state,
        done: action.done,
        appStreak: action.appStreak,
      };
    }
    default: {
      throw Error(`Unknown dashboard action: ${action.type}`);
    }
  }
}
