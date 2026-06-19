"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  PROBLEMS,
  Problem,
  sortByCategory,
  DIFFICULTY_COLOR,
} from "@/lib/problems";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export default function Home() {
  const { user } = db.useAuth();
  // Problems come from InstantDB; fall back to the bundled JSON until seeded.
  // Progress is scoped to the signed-in user.
  const { data } = db.useQuery(
    user
      ? { problems: {}, progress: { $: { where: { userId: user.id } } } }
      : { problems: {} }
  );

  const problems: Problem[] = useMemo(() => {
    const fromDb = (data?.problems ?? []) as unknown as Problem[];
    return fromDb.length ? [...fromDb].sort((a, b) => a.pid - b.pid) : PROBLEMS;
  }, [data]);

  const statusByPid = useMemo(() => {
    const m: Record<number, string> = {};
    for (const p of data?.progress ?? []) m[(p as any).pid] = (p as any).status;
    return m;
  }, [data]);

  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState<string | null>(null);
  const [onlyUnsolved, setOnlyUnsolved] = useState(false);

  const filtered = problems.filter((p) => {
    if (diff && p.difficulty !== diff) return false;
    if (onlyUnsolved && statusByPid[p.pid] === "solved") return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.type.toLowerCase().includes(q) &&
        !p.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  const groups = useMemo(() => {
    const g: Record<string, Problem[]> = {};
    for (const p of filtered) (g[p.type] ??= []).push(p);
    return Object.keys(g)
      .sort(sortByCategory)
      .map((type) => ({ type, items: g[type].sort((a, b) => a.no - b.no) }));
  }, [filtered]);

  const solvedCount = Object.values(statusByPid).filter(
    (s) => s === "solved"
  ).length;
  const pct = Math.round((solvedCount / problems.length) * 100) || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Blind 75</h1>
        <p className="text-muted text-sm">
          Practice the essential interview problems, then reveal a worked
          solution.
        </p>
      </div>

      {/* progress */}
      <div className="mb-6 rounded-lg border border-border bg-panel p-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted">Progress</span>
          <span className="font-mono">
            {solvedCount}/{problems.length} solved
          </span>
        </div>
        <div className="h-2 rounded-full bg-bg overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, category, or tag…"
          className="flex-1 min-w-[200px] rounded-md border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDiff(diff === d ? null : d)}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                diff === d
                  ? "border-accent text-white"
                  : "border-border text-muted hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOnlyUnsolved(!onlyUnsolved)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            onlyUnsolved
              ? "border-accent text-white"
              : "border-border text-muted hover:text-white"
          }`}
        >
          Unsolved
        </button>
      </div>

      {/* list */}
      <div className="space-y-6">
        {groups.map(({ type, items }) => (
          <section key={type}>
            <h2 className="mb-2 text-sm font-semibold text-muted uppercase tracking-wide">
              {type}{" "}
              <span className="text-border">({items.length})</span>
            </h2>
            <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
              {items.map((p) => {
                const status = statusByPid[p.pid];
                return (
                  <Link
                    key={p.pid}
                    href={`/problem/${p.pid}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-panel transition-colors"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        status === "solved"
                          ? "bg-green-400"
                          : status === "attempted"
                            ? "bg-yellow-400"
                            : "bg-border"
                      }`}
                      title={status ?? "todo"}
                    />
                    <span className="font-mono text-xs text-muted w-8 shrink-0">
                      {p.no}
                    </span>
                    <span className="flex-1 text-sm">{p.title}</span>
                    <span
                      className={`text-xs ${DIFFICULTY_COLOR[p.difficulty]}`}
                    >
                      {p.difficulty}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        {groups.length === 0 && (
          <p className="text-muted text-sm py-12 text-center">
            No problems match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
