import { useReducer } from "react";
import {
  markAppDone,
  markProblemDone,
} from "../lib/appStreak.js";
import { getSummary } from "../lib/leetcode.js";
import {
  createDashboardState,
  dashboardReducer,
  DIFFICULTIES,
  getDefaultSummary,
} from "./dashboardReducer.js";

export { DIFFICULTIES };

async function fetchSummary(username, difficulty) {
  try {
    const summary = await getSummary(username.trim(), difficulty);
    return { summary, status: "" };
  } catch (err) {
    return { summary: getDefaultSummary(), status: err.message };
  }
}

export function useDashboard() {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    null,
    createDashboardState,
  );

  async function loadSummary(event) {
    event.preventDefault();
    dispatch({ type: "summaryRequested" });
    const summaryState = await fetchSummary(state.username, state.difficulty);
    dispatch({ type: "summaryLoaded", payload: summaryState });
  }

  function markProblemCompleted(problem) {
    dispatch({
      type: "problemCompleted",
      done: markProblemDone(problem.url),
      appStreak: markAppDone(),
    });
  }

  function openProblem(problem) {
    window.open(problem.url, "_blank", "noopener,noreferrer");
  }

  return {
    state,
    loadSummary,
    markProblemCompleted,
    openProblem,
    setDifficulty: (value) =>
      dispatch({ type: "fieldChanged", field: "difficulty", value }),
    setUsername: (value) =>
      dispatch({ type: "fieldChanged", field: "username", value }),
  };
}
