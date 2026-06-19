"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-md border border-border px-2 py-1 text-sm text-muted hover:text-fg transition-colors leading-none"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
