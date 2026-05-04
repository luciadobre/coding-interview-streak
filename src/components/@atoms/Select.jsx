const selectStyle =
  "h-11 rounded-ui border border-line bg-card px-3 text-sm outline-none focus:border-accent2";

export default function Select({ children, className = "", ...props }) {
  return (
    <select
      className={[selectStyle, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
