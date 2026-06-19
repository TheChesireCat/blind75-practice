import { LEGEND, toneColor } from "@/lib/viz/tones";

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {LEGEND.map((l) => (
        <span key={l.tone} className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: toneColor(l.tone), opacity: 0.85 }}
          />
          {l.label}
        </span>
      ))}
    </div>
  );
}
