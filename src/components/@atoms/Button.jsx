const buttonStyles = {
  primary:
    "flex h-11 items-center justify-center gap-3 rounded-ui bg-accent px-4 font-black text-onAccent disabled:opacity-40",
  icon:
    "grid h-11 place-items-center rounded-ui bg-accent text-onAccent disabled:opacity-40",
};

export default function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={[buttonStyles[variant], className].filter(Boolean).join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
