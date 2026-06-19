"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/db";
import SignIn from "./SignIn";

// Keep an httpOnly session cookie in sync with the InstantDB client session,
// so the server can authenticate requests too.
function useSessionCookieSync(user: { refresh_token: string } | null) {
  const lastToken = useRef<string | null>(null);
  useEffect(() => {
    const token = user?.refresh_token ?? null;
    if (token === lastToken.current) return;
    lastToken.current = token;
    if (token) {
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }),
      }).catch(() => {});
    } else {
      fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    }
  }, [user]);
}

export default function AuthControls() {
  const { isLoading, user } = db.useAuth();
  const [open, setOpen] = useState(false);

  useSessionCookieSync(user ?? null);

  async function signOut() {
    await db.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
  }

  if (isLoading) {
    return <span className="text-xs text-muted">…</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <span className="text-muted hidden sm:inline">{user.email}</span>
        <button
          onClick={signOut}
          className="rounded-md border border-border px-2.5 py-1 text-muted hover:text-fg transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white"
      >
        Sign in
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-border bg-panel p-4 shadow-xl">
            <SignIn onDone={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
