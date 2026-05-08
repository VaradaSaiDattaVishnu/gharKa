import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        turmeric: {
          DEFAULT: "#E8913A",
          dark: "#C47425",
          light: "#FFF3E0",
        },
        coriander: {
          DEFAULT: "#2E7D52",
          dark: "#1B5E3A",
          light: "#E8F5E9",
        },
        terracotta: "#D84315",
        charcoal: "#263238",
        slate: "#546E7A",
        ash: "#90A4AE",
        mist: "#E0E7EA",
        cloud: "#F5F7F8",
        error: "#C62828",
        warning: "#F9A825",
        info: "#1565C0",
      },
      fontFamily: {
        heading: ["var(--font-nunito)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        handwritten: ["var(--font-caveat)", "cursive"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        steam: "steam 3s ease-out infinite",
        "pulse-warm": "pulse-warm 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        steam: {
          "0%": { opacity: "0", transform: "translateY(0) scale(0.5)" },
          "50%": { opacity: "0.6" },
          "100%": {
            opacity: "0",
            transform: "translateY(-30px) scale(1.5)",
          },
        },
        "pulse-warm": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(232, 145, 58, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(232, 145, 58, 0)",
          },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
