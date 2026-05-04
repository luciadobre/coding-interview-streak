export default function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-ui bg-card p-3">
      <Icon className="text-muted" size={17} />
      <p className="mt-2 text-xs text-muted">{label}</p>
      <strong className="mt-1 block text-xl">{value}</strong>
    </article>
  );
}
