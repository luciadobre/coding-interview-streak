import {
  Activity,
  CalendarDays,
  Code2,
  Flame,
  SquareStack,
} from "lucide-react";
import StatCard from "./StatCard.jsx";

export default function StatsGrid({ appStreak, summary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {[
        ["App streak", appStreak, Flame],
        ["LC streak", summary.streak, Flame],
        ["Active days", summary.totalActiveDays, CalendarDays],
        ["Easy", summary.easySolved, SquareStack],
        ["Medium", summary.mediumSolved, Activity],
        ["Hard", summary.hardSolved, Code2],
      ].map(([label, value, Icon]) => (
        <StatCard key={label} icon={Icon} label={label} value={value} />
      ))}
    </div>
  );
}
