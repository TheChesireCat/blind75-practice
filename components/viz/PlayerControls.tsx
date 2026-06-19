"use client";

const SPEEDS = [0.5, 1, 2];

export default function PlayerControls({
  index,
  count,
  playing,
  speed,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  onSpeed,
}: {
  index: number;
  count: number;
  playing: boolean;
  speed: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (v: number) => void;
  onSpeed: (v: number) => void;
}) {
  const btn =
    "rounded-md border border-border px-2.5 py-1 text-sm text-muted hover:text-fg transition-colors disabled:opacity-40 disabled:hover:text-muted";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onPrev} disabled={index <= 0} className={btn} aria-label="Step back">
        ◀
      </button>
      <button onClick={onToggle} className={`${btn} w-16`}>
        {playing ? "❚❚ Pause" : index >= count - 1 ? "↻ Replay" : "▶ Play"}
      </button>
      <button
        onClick={onNext}
        disabled={index >= count - 1}
        className={btn}
        aria-label="Step forward"
      >
        ▶
      </button>
      <input
        type="range"
        min={0}
        max={count - 1}
        value={index}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="flex-1 min-w-[120px] accent-accent"
        aria-label="Scrub steps"
      />
      <span className="font-mono text-xs text-muted tabular-nums">
        {index + 1}/{count}
      </span>
      <div className="flex gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed(s)}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              speed === s
                ? "border-accent text-fg"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
