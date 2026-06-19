"use client";

import { useState } from "react";
import { db } from "@/lib/db";

export default function SignIn({ onDone }: { onDone?: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await db.auth.sendMagicCode({ email });
      setSent(true);
    } catch (err: any) {
      setError(err?.body?.message ?? "Couldn't send code. Check the email.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await db.auth.signInWithMagicCode({ email, code });
      onDone?.();
    } catch (err: any) {
      setError(err?.body?.message ?? "Invalid code. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      {!sent ? (
        <form onSubmit={sendCode} className="space-y-3">
          <p className="text-sm text-muted">
            Sign in to save your progress. We&apos;ll email you a one-time code.
          </p>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            disabled={busy}
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm text-muted">
            Enter the code sent to <span className="text-white">{email}</span>.
          </p>
          <input
            inputMode="numeric"
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm font-mono tracking-widest outline-none focus:border-accent"
          />
          <button
            disabled={busy}
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify & sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setCode("");
              setError(null);
            }}
            className="w-full text-xs text-muted hover:text-white"
          >
            ← use a different email
          </button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
