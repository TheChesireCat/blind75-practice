"use client";

import type { Frame, Tone } from "@/lib/viz/types";
import { toneColor } from "@/lib/viz/tones";

// layout constants
const BOX = 48;
const GAP = 14;
const PAD = 18;
const TOP = 80; // room above boxes for arrow arc + stacked top pointers
const DP_GAP = 26; // vertical gap between main row and dp row
const BELOW = 36; // room below the lowest row for bottom pointers

export default function SequenceView({ frame }: { frame: Frame }) {
  const a = frame.array;
  const n = a.length;
  const cellX = (i: number) => PAD + i * (BOX + GAP);
  const cx = (i: number) => cellX(i) + BOX / 2;
  const boxY = TOP;
  const hasDp = !!frame.dp;
  const dpY = boxY + BOX + DP_GAP;
  const lowestBottom = hasDp ? dpY + BOX : boxY + BOX;

  const W = PAD * 2 + n * BOX + Math.max(0, n - 1) * GAP;
  const H = lowestBottom + BELOW;

  const fg = "rgb(var(--c-fg))";
  const muted = "rgb(var(--c-muted))";

  const topPointers = (frame.pointers ?? []).filter((p) => p.side !== "bottom");
  const bottomPointers = (frame.pointers ?? []).filter((p) => p.side === "bottom");

  const cellRect = (
    i: number,
    y: number,
    value: number | string | null,
    tone?: Tone
  ) => {
    const stroke = tone ? toneColor(tone) : "rgb(var(--c-border))";
    const fill = tone ? toneColor(tone) : "rgb(var(--c-bg))";
    const empty = value === null || value === undefined || value === "";
    return (
      <g key={`${y}-${i}`}>
        <rect
          x={cellX(i)}
          y={y}
          width={BOX}
          height={BOX}
          rx={8}
          style={{
            fill: empty ? "rgb(var(--c-bg))" : fill,
            fillOpacity: tone && !empty ? 0.18 : empty ? 0.4 : 1,
            stroke,
            strokeWidth: tone ? 2 : 1,
            strokeDasharray: empty ? "3 3" : undefined,
            transition: "fill .3s, stroke .3s, fill-opacity .3s",
          }}
        />
        <text x={cellX(i) + 6} y={y + 11} fontSize="8" style={{ fill: muted }}>
          {i}
        </text>
        {!empty && (
          <text
            x={cx(i)}
            y={y + BOX / 2 + 4}
            textAnchor="middle"
            fontSize="17"
            style={{ fill: fg }}
          >
            {String(value)}
          </text>
        )}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ fontFamily: "var(--font-mono)", maxWidth: "100%" }}
      role="img"
    >
      {/* sliding window bracket */}
      {frame.window &&
        (() => {
          const { from, to, label, tone } = frame.window!;
          const col = toneColor(tone ?? "blue");
          const x = cellX(from) - 5;
          const w = cellX(to) + BOX + 5 - x;
          return (
            <g style={{ transition: "opacity .3s" }}>
              <rect
                x={x}
                y={boxY - 5}
                width={w}
                height={BOX + 10}
                rx={10}
                style={{
                  fill: col,
                  fillOpacity: 0.08,
                  stroke: col,
                  strokeWidth: 1.5,
                  strokeDasharray: "4 3",
                }}
              />
              {label && (
                <text x={x + 4} y={boxY - 9} fontSize="9" style={{ fill: col }}>
                  {label}
                </text>
              )}
            </g>
          );
        })()}

      {/* arrow (above the boxes) */}
      {frame.arrow &&
        (() => {
          const { from, to, label, tone } = frame.arrow!;
          const col = toneColor(tone ?? "green");
          const x1 = cx(from);
          const x2 = cx(to);
          const apex = boxY - Math.min(58, 22 + Math.abs(to - from) * 9);
          const midX = (x1 + x2) / 2;
          return (
            <g>
              <path
                d={`M ${x1} ${boxY - 2} Q ${midX} ${apex} ${x2} ${boxY - 2}`}
                fill="none"
                style={{ stroke: col, strokeWidth: 2 }}
              />
              <path
                d={`M ${x2 - 5} ${boxY - 8} L ${x2 + 5} ${boxY - 8} L ${x2} ${boxY} Z`}
                style={{ fill: col }}
              />
              {label && (
                <text
                  x={midX}
                  y={apex + 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={600}
                  style={{ fill: col }}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })()}

      {/* main array cells */}
      {a.map((v, i) => cellRect(i, boxY, v, frame.highlights?.[i]))}

      {/* dp row */}
      {hasDp && (
        <>
          <text
            x={PAD}
            y={dpY - 8}
            fontSize="9"
            style={{ fill: muted }}
          >
            {frame.dp!.label ?? "dp"}
          </text>
          {frame.dp!.values.map((v, i) =>
            cellRect(i, dpY, v, frame.dp!.highlights?.[i])
          )}
        </>
      )}

      {/* top pointers (stacked by list order to avoid label overlap) */}
      {topPointers.map((p, level) => {
        const col = toneColor(p.tone ?? "blue");
        return (
          <g
            key={`tp-${p.label}-${level}`}
            style={{
              transform: `translateX(${cx(p.index)}px)`,
              transition: "transform .35s ease",
            }}
          >
            <text
              x={0}
              y={boxY - 18 - level * 12}
              textAnchor="middle"
              fontSize="10"
              style={{ fill: col }}
            >
              {p.label}
            </text>
            <path
              d={`M -6 ${boxY - 12} L 6 ${boxY - 12} L 0 ${boxY - 3} Z`}
              style={{ fill: col }}
            />
          </g>
        );
      })}

      {/* bottom pointers */}
      {bottomPointers.map((p, level) => {
        const col = toneColor(p.tone ?? "yellow");
        const y = lowestBottom + 8 + level * 19;
        return (
          <g
            key={`bp-${p.label}-${level}`}
            style={{
              transform: `translateX(${cx(p.index)}px)`,
              transition: "transform .35s ease",
            }}
          >
            <rect
              x={-32}
              y={y}
              width={64}
              height={17}
              rx={8}
              style={{ fill: col, fillOpacity: 0.18, stroke: col }}
            />
            <text
              x={0}
              y={y + 11.5}
              textAnchor="middle"
              fontSize="9"
              style={{ fill: col }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
