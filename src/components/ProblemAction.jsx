import { Button, Input } from "./@atoms/index.js";

export default function ProblemAction({
  done,
  markProblemCompleted,
  icon: Icon,
  openProblem,
  problem,
  title,
}) {
  return (
    <article className="rounded-ui bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-muted">{title}</p>
          <h2 className="mt-2 text-base font-black">{problem.title}</h2>
          <p className="mt-3 text-xs font-bold text-muted">
            {problem.difficulty} {problem.date}
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-muted">
          Done
          <Input
            checked={done}
            disabled={done || problem.url.length === 0}
            onChange={() => markProblemCompleted(problem)}
            type="checkbox"
          />
          <span
            className={
              done
                ? "pointer-events-none absolute -translate-y-7 translate-x-5 animate-confetti text-accent2"
                : "hidden"
            }
          >
            * . *
          </span>
        </label>
      </div>
      <Button
        disabled={problem.url.length === 0}
        onClick={() => openProblem(problem)}
        className="mt-4 w-full"
      >
        <Icon size={18} />
        Open problem
      </Button>
    </article>
  );
}
