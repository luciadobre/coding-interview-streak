import Controls from "./components/Controls.jsx";
import ProblemGrid from "./components/ProblemGrid.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StatsGrid from "./components/StatsGrid.jsx";
import { DIFFICULTIES, useDashboard } from "./hooks/useDashboard.js";

export default function App() {
  const {
    state,
    loadSummary,
    markProblemCompleted,
    openProblem,
    setDifficulty,
    setUsername,
  } = useDashboard();

  return (
    <main className="min-h-screen bg-page p-4 text-main md:p-10">
      <section className="mx-auto grid max-w-app overflow-hidden rounded-shell bg-shell shadow-ui md:grid-cols-[76px_1fr]">
        <Sidebar />
        <div className="space-y-7 p-5 md:p-9">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-accent2">
                LeetCode dashboard
              </p>
              <h1 className="mt-2 text-3xl font-black">
                Coding Interview Streak
              </h1>
            </div>
            <Controls
              difficulty={state.difficulty}
              difficulties={DIFFICULTIES}
              loading={state.loading}
              setDifficulty={setDifficulty}
              setUsername={setUsername}
              username={state.username}
              onSubmit={loadSummary}
            />
          </header>

          <p className="min-h-11 rounded-ui border border-line bg-card p-3 text-sm text-muted">
            {state.status}
          </p>

          <StatsGrid appStreak={state.appStreak} summary={state.summary} />
          <ProblemGrid
            difficulty={state.difficulty}
            done={state.done}
            markProblemCompleted={markProblemCompleted}
            openProblem={openProblem}
            summary={state.summary}
          />
        </div>
      </section>
    </main>
  );
}
