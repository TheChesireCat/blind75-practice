import type { Tone } from "./types";

// Map semantic tones to theme tokens (channel triplets) so visuals follow
// light/dark mode. Used via inline `style` because CSS var() does not resolve
// inside SVG presentation *attributes* — only in style/CSS.
const TOKEN: Record<Tone, string> = {
  blue: "--c-accent",
  yellow: "--c-medium",
  green: "--c-easy",
  gray: "--c-muted",
  red: "--c-hard",
};

export function toneColor(tone: Tone): string {
  return `rgb(var(${TOKEN[tone]}))`;
}

export const LEGEND: { tone: Tone; label: string }[] = [
  { tone: "blue", label: "current" },
  { tone: "yellow", label: "min / buy" },
  { tone: "green", label: "best / good" },
  { tone: "gray", label: "skipped" },
];
