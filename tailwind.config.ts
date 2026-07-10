import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F4E8D4",
        paper2: "#FBF5E9",
        paper3: "#EBDCC1",
        ink: "#3E2F26",
        inksoft: "#6E5949",
        tomato: "#CE5138",
        tomatodeep: "#A63A24",
        sage: "#7E8C5C",
        sagedeep: "#5C6A3E",
        mustard: "#DBA23C",
        mustarddeep: "#B8801E",
        plum: "#8E5D6E",
        apron: "#4E7FA8",
        cream: "#FEFAF2",
        line: "#DAC6A3",
        muted: "#9C876F",
      },
      fontFamily: {
        hand: ["var(--font-hand)", "cursive"],
        serif2: ["var(--font-serif)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "5px 5px 0 rgba(62,47,38,.85), 0 8px 18px rgba(62,47,38,.11)",
        cardsm: "3px 3px 0 rgba(62,47,38,.85)",
        cardxs: "2px 2px 0 rgba(62,47,38,.85)",
        cardhover: "8px 8px 0 rgba(62,47,38,.85), 0 12px 26px rgba(62,47,38,.13)",
      },
      borderRadius: { card: "18px" },
    },
  },
  plugins: [],
};
export default config;
