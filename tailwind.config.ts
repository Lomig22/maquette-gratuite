import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1624",
        accent: "#E8611A",
        secondary: "#8892A4",
        "bubble-agent": "#1A2535",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
