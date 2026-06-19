"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { db } from "@/lib/db";
import { id } from "@instantdb/react";
import { PROBLEMS, Problem, DIFFICULTY_COLOR } from "@/lib/problems";

const STATUSES = [
  { key: "todo", label: "To do" },
  { key: "attempted", label: "Attempted" },
  { key: "solved", label: "Solved" },
] as const;

export default function ProblemPage({ params }: { params: { id: string } }) {
  const pid = Number(params.id);
  const { user } = db.useAuth();

  const { data } = db.useQuery(
    user
      ? {
          problems: { $: { where: { pid } } },
          progress: { $: { where: { userId: user.id, pid } } },
        }
      : { problems: { $: { where: { pid } } } }
  );

  // Prefer DB problem, fall back to bundled JSON so it works pre-seed.
  const problem: Problem | undefined = useMemo(() => {
    const fromDb = (data?.problems?.[0] ?? undefined) as unknown as
      | Problem
      | undefined;
    return fromDb ?? PROBLEMS.find((p) => p.pid === pid);
  }, [data, pid]);

  const progress = data?.progress?.[0] as any | undefined;

  const [scratch, setScratch] = useState("");
  const [notes, setNotes] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  // Stable id for this problem's progress row, created on first write.
  const [rowId] = useState(() => id());

  // Load saved scratch/notes once when progress arrives.
  useEffect(() => {
    if (progress && !hydrated) {
      setScratch(progress.scratch ?? "");
      setNotes(progress.notes ?? "");
      setHydrated(true);
    }
  }, [progress, hydrated]);

  function save(patch: Record<string, unknown>) {
    if (!user) return; // progress requires sign-in
    db.transact(
      db.tx.progress[progress?.id ?? rowId].update({
        userId: user.id,
        pid,
        updatedAt: Date.now(),
        ...patch,
      })
    );
  }

  if (!problem) {
    return (
      <div className="py-12 text-center text-muted">
        <p>Problem not found.</p>
        <Link href="/" className="text-accent">
          ← back to list
        </Link>
      </div>
    );
  }

  const status = progress?.status ?? "todo";

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-muted hover:text-white transition-colors"
      >
        ← all problems
      </Link>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold break-words">
            {problem.no}. {problem.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className={DIFFICULTY_COLOR[problem.difficulty]}>
              {problem.difficulty}
            </span>
            <span className="text-border">·</span>
            <span className="text-muted">{problem.type}</span>
            {problem.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-panel border border-border px-1.5 py-0.5 text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <a
          href={problem.slug}
          target="_blank"
          rel="noreferrer"
          className="self-start shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-white transition-colors"
        >
          LeetCode ↗
        </a>
      </div>

      {!user && (
        <div className="mt-4 rounded-md border border-border bg-panel px-3 py-2 text-xs text-muted">
          Sign in (top right) to track status, save a scratchpad, and keep notes.
        </div>
      )}

      {/* status */}
      <div className="mt-4 flex flex-wrap gap-1">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => save({ status: s.key })}
            className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
              status === s.key
                ? "border-accent text-white"
                : "border-border text-muted hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* description */}
        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-semibold text-muted uppercase tracking-wide">
            Problem
          </h2>
          <div
            className="problem-body rounded-lg border border-border bg-panel p-4 text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: problem.description }}
          />
        </div>

        {/* practice */}
        <div className="space-y-6 min-w-0">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
                Scratchpad
              </h2>
              <button
                onClick={() => save({ scratch })}
                className="text-xs text-accent hover:underline"
              >
                save
              </button>
            </div>
            <textarea
              value={scratch}
              onChange={(e) => setScratch(e.target.value)}
              onBlur={() => save({ scratch })}
              spellCheck={false}
              placeholder="# write your attempt here…"
              className="h-64 w-full resize-y rounded-lg border border-border bg-bg p-3 font-mono text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-muted uppercase tracking-wide">
              Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => save({ notes })}
              placeholder="Key insight, edge cases, complexity…"
              className="h-20 w-full resize-y rounded-lg border border-border bg-bg p-3 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
                Solution
              </h2>
              <button
                onClick={() => setShowSolution((v) => !v)}
                className="rounded-md border border-border px-3 py-1 text-xs text-muted hover:text-white transition-colors"
              >
                {showSolution ? "Hide" : "Reveal"}
              </button>
            </div>
            {showSolution ? (
              <div className="rounded-lg border border-border overflow-x-auto text-sm">
                <SyntaxHighlighter
                  language="python"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    background: "#161b22",
                    fontSize: "0.8rem",
                  }}
                >
                  {problem.solution}
                </SyntaxHighlighter>
              </div>
            ) : (
              <button
                onClick={() => setShowSolution(true)}
                className="w-full rounded-lg border border-dashed border-border py-10 text-sm text-muted hover:border-accent hover:text-white transition-colors"
              >
                Solution hidden — give it a try first
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
