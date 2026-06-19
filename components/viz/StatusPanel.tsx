import type { Frame } from "@/lib/viz/types";
import { toneColor } from "@/lib/viz/tones";

export default function StatusPanel({ rows }: { rows: NonNullable<Frame["panel"]> }) {
  if (!rows.length) return null;
  return (
    <div className="rounded-md border border-border bg-bg p-3 text-sm font-mono space-y-1.5 self-start min-w-[180px]">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-6">
          <span className="text-muted">{r.label}</span>
          <span style={r.tone ? { color: toneColor(r.tone) } : undefined}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
