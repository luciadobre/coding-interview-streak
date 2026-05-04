export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        ui: "8px",
        shell: "14px",
      },
      boxShadow: {
        ui: "0 28px 80px rgb(0 0 0 / 0.34)",
      },
      colors: {
        page: "#505057",
        shell: "#171718",
        rail: "#101012",
        card: "#25252a",
        line: "#35353d",
        muted: "#8d8d99",
        main: "#ffffff",
        accent: "#a59be6",
        accent2: "#c7eff0",
        onAccent: "#101012",
      },
      maxWidth: {
        app: "1090px",
      },
      keyframes: {
        confetti: {
          "0%": { opacity: "0", transform: "translate(14px, 0) scale(0.6)" },
          "35%": { opacity: "1", transform: "translate(20px, -20px) scale(1)" },
          "100%": { opacity: "0", transform: "translate(28px, -34px) scale(1.15)" },
        },
      },
      animation: {
        confetti: "confetti 900ms ease-out both",
      },
    },
  },
  plugins: [],
};
