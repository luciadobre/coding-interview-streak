import { Check, Flame, LayoutGrid, LogOut, UserRound } from "lucide-react";

const icons = [LayoutGrid, Flame, Check, UserRound];

export default function Sidebar() {
  return (
    <aside className="hidden bg-rail py-8 md:flex md:flex-col md:items-center">
      <div className="mb-12 grid size-8 place-items-center rounded-ui bg-accent text-onAccent">LC</div>
      <nav className="flex flex-1 flex-col gap-6 text-muted">
        {icons.map((Icon, i) => <Icon key={i} className={i === 0 ? "text-accent2" : ""} size={18} />)}
      </nav>
      <LogOut className="text-muted" size={18} />
    </aside>
  );
}
