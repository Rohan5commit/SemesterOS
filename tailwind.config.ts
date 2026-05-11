import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070A1A",
        aurora: "#73B8FF",
        lilac: "#A787FF",
        mint: "#74F0C4"
      },
      boxShadow: {
        glow: "0 12px 44px rgba(115, 184, 255, 0.35)"
      },
      backgroundImage: {
        'mesh': 'radial-gradient(circle at 20% 20%, rgba(115,184,255,.28), transparent 40%), radial-gradient(circle at 80% 0%, rgba(167,135,255,.2), transparent 45%), linear-gradient(140deg, #070A1A, #101738 55%, #0C1530)'
      }
    }
  },
  plugins: []
};

export default config;
