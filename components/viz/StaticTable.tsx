import type { Frame } from "@/lib/viz/types";

// The "tabulature" — derived from the same frames, with the current step
// highlighted so the table and animation stay in lock-step.
export default function StaticTable({
  columns,
  frames,
  current,
}: {
  columns: string[];
  frames: Frame[];
  current: number;
}) {
  const rows = frames
    .map((f, idx) => ({ idx, row: f.row }))
    .filter((r): r is { idx: number; row: (string | number)[] } => !!r.row);

  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="text-muted">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ idx, row }) => (
            <tr
              key={idx}
              className={`border-t border-border transition-colors ${
                idx === current ? "bg-accent/10 text-fg" : "text-muted"
              }`}
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-1.5 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
