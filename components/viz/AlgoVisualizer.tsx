"use client";

import { useEffect, useState } from "react";
import type { Visualization } from "@/lib/viz/types";
import SequenceView from "./SequenceView";
import StatusPanel from "./StatusPanel";
import StaticTable from "./StaticTable";
import Legend from "./Legend";
import PlayerControls from "./PlayerControls";

export default function AlgoVisualizer({ viz }: { viz: Visualization }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const count = viz.frames.length;
  const frame = viz.frames[index];
  const atEnd = index >= count - 1;

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIndex((x) => Math.min(x + 1, count - 1)), 1100 / speed);
    return () => clearTimeout(t);
  }, [playing, index, atEnd, count, speed]);

  return (
    <div className="rounded-lg border border-border bg-panel p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{viz.title}</h3>
        <Legend />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0 overflow-x-auto">
          <SequenceView frame={frame} />
        </div>
        <StatusPanel rows={frame.panel ?? []} />
      </div>

      <p className="text-sm text-muted min-h-[2.5rem] sm:min-h-[1.25rem]">
        {frame.message}
      </p>

      <PlayerControls
        index={index}
        count={count}
        playing={playing}
        speed={speed}
        onToggle={() => {
          if (atEnd) setIndex(0);
          setPlaying((p) => !p);
        }}
        onPrev={() => {
          setPlaying(false);
          setIndex((x) => Math.max(0, x - 1));
        }}
        onNext={() => {
          setPlaying(false);
          setIndex((x) => Math.min(count - 1, x + 1));
        }}
        onSeek={(v) => {
          setPlaying(false);
          setIndex(v);
        }}
        onSpeed={setSpeed}
      />

      <StaticTable columns={viz.columns} frames={viz.frames} current={index} />
    </div>
  );
}
