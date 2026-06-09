import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2a4a",
          light: "#243560",
          dark: "#111d33",
        },
        cream: {
          DEFAULT: "#f5f0e8",
          light: "#fdfaf5",
          dark: "#ede6d6",
        },
        gold: {
          DEFAULT: "#c9a96e",
          light: "#dfc08a",
          dark: "#a8844a",
        },
      },
      fontFamily: {
        arabic: ["'Noto Naskh Arabic'", "serif"],
        latin: ["'Cormorant Garamond'", "serif"],
        amiri: ["'Amiri'", "serif"],
      },
      backgroundImage: {
        geometric: "url('/pattern.svg')",
      },
      boxShadow: {
        invitation: "0 4px 6px -1px rgba(26,42,74,0.08), 0 20px 60px -10px rgba(26,42,74,0.18), 0 0 0 4px rgba(201,169,110,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
