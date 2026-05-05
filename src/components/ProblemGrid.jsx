import { RotateCcw, Search } from "lucide-react";
import ProblemAction from "./ProblemAction.jsx";

const titles = {
  Any: "Daily challenge",
  Easy: "Start problem",
  Medium: "Start problem",
  Hard: "Start problem",
};

export default function ProblemGrid({
  difficulty,
  done,
  markProblemCompleted,
  openProblem,
  summary,
}) {
  const isDone = (problem) => done.has(problem.url);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ProblemAction
        done={isDone(summary.startProblem)}
        markProblemCompleted={markProblemCompleted}
        icon={Search}
        openProblem={openProblem}
        problem={summary.startProblem}
        title={titles[difficulty]}
      />
      <ProblemAction
        done={isDone(summary.recapProblem)}
        markProblemCompleted={markProblemCompleted}
        icon={RotateCcw}
        openProblem={openProblem}
        problem={summary.recapProblem}
        title="Oldest recent solve"
      />
    </div>
  );
}
