import type { Config } from "tailwindcss";

// Colors are driven by CSS variables (see globals.css) so a single class on
// <html> ("light"/"dark") flips the whole palette. Channels are space-
// separated RGB to keep Tailwind's opacity modifiers (e.g. bg-panel/60) working.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: v("--c-bg"),
        panel: v("--c-panel"),
        border: v("--c-border"),
        accent: v("--c-accent"),
        muted: v("--c-muted"),
        fg: v("--c-fg"),
        easy: v("--c-easy"),
        medium: v("--c-medium"),
        hard: v("--c-hard"),
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
