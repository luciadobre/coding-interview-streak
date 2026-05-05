import { Button, Input } from "./@atoms/index.js";
import { TAG_GUIDES } from "../lib/tagGuides.js";

export default function ProblemAction({
  done,
  markProblemCompleted,
  icon: Icon,
  openProblem,
  problem,
  title,
}) {
  const guidedTags = problem.topicTags.filter(({ slug }) => TAG_GUIDES[slug]);

  return (
    <article className="rounded-ui bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-muted">{title}</p>
          <h2 className="mt-2 text-base font-black">{problem.title}</h2>
          <p className="mt-3 text-xs font-bold text-muted">
            {problem.difficulty} {problem.date}
          </p>
          {guidedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {guidedTags.map(({ name, slug }) => (
                <a
                  key={slug}
                  className="rounded border border-accent/40 px-2 py-0.5 text-xs font-bold text-accent hover:border-accent"
                  href={TAG_GUIDES[slug]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-muted">
          Done
          <Input
            checked={done}
            disabled={done}
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
      <Button onClick={() => openProblem(problem)} className="mt-4 w-full">
        <Icon size={18} />
        Open problem
      </Button>
    </article>
  );
}
