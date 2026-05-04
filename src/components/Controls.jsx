import { Search } from "lucide-react";
import { Button, Dropdown, Input } from "./@atoms/index.js";

export default function Controls({
  difficulty,
  difficulties,
  loading,
  setDifficulty,
  setUsername,
  username,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_130px_46px]">
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="leetcode username"
      />
      <Dropdown
        value={difficulty}
        options={difficulties}
        onChange={(e) => setDifficulty(e.target.value)}
      />
      <Button title="Refresh" disabled={loading} type="submit" variant="icon">
        <Search size={18} />
      </Button>
    </form>
  );
}
