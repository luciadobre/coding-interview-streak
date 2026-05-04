import { getCookie } from "../lib/cookies.js";
import { getAppStreak, getDoneProblems } from "../lib/appStreak.js";
import { emptySummary } from "../lib/leetcode.js";

export const DIFFICULTIES = ["Any", "Easy", "Medium", "Hard"];

const COOKIE_KEYS = {
  username: "lc_username",
  difficulty: "lc_difficulty",
  streak: "lc_streak",
};

const DEFAULT_VALUES = {
  difficulty: "Any",
  streak: "0",
};

export const getDefaultSummary = () => ({
  ...emptySummary,
  streak: getCookie(COOKIE_KEYS.streak, DEFAULT_VALUES.streak),
});

export function createDashboardState() {
  return {
    username: getCookie(COOKIE_KEYS.username),
    difficulty: getCookie(COOKIE_KEYS.difficulty, DEFAULT_VALUES.difficulty),
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
