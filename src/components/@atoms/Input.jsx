const inputStyles = {
  checkbox: "size-5 accent-accent2",
  text: "h-11 rounded-ui border border-line bg-card px-3 text-sm outline-none focus:border-accent2",
};

export default function Input({ className = "", type = "text", ...props }) {
  const variant = type === "checkbox" ? "checkbox" : "text";

  return (
    <input
      className={[inputStyles[variant], className].filter(Boolean).join(" ")}
      type={type}
      {...props}
    />
  );
}
