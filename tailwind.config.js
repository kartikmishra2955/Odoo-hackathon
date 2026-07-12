/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#10131A",
        panel: "#171B24",
        "panel-2": "#1D222C",
        border: {
          DEFAULT: "#282F3B",
          soft: "#1F2530",
        },
        ink: {
          DEFAULT: "#EDEFF3",
          dim: "#8B93A4",
          faint: "#576073",
        },
        accent: {
          DEFAULT: "#4C8CFF",
          soft: "rgba(76,140,255,.13)",
        },
        critical: {
          DEFAULT: "#F1543E",
          soft: "rgba(241,84,62,.13)",
        },
        monitor: {
          DEFAULT: "#F2B33D",
          soft: "rgba(242,179,61,.13)",
        },
        stable: {
          DEFAULT: "#35C48A",
          soft: "rgba(53,196,138,.13)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
    },
  },
  plugins: [],
};
