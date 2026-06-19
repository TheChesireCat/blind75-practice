import type { Metadata } from "next";
import Link from "next/link";
import AuthControls from "@/components/AuthControls";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blind 75 — Practice",
  description: "Practice the Blind 75 LeetCode problems and review solutions.",
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const noFlash = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <header className="border-b border-border bg-panel/60 backdrop-blur sticky top-0 z-10">
            <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="font-mono font-semibold tracking-tight">
                <span className="text-accent">blind</span>75
              </Link>
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href="https://www.techinterviewhandbook.org/grind75/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted hover:text-fg transition-colors hidden sm:inline"
                >
                  about the list ↗
                </a>
                <ThemeToggle />
                <AuthControls />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
