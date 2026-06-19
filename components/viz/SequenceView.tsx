"use client";

import type { Frame } from "@/lib/viz/types";
import { toneColor } from "@/lib/viz/tones";

// layout constants
const BOX = 48;
const GAP = 14;
const PAD = 18;
const TOP = 78; // room above boxes for the profit arrow arc + current pointer
const BELOW = 34; // room below boxes for the min/buy marker

export default function SequenceView({ frame }: { frame: Frame }) {
  const a = frame.array;
  const n = a.length;
  const cellX = (i: number) => PAD + i * (BOX + GAP);
  const cx = (i: number) => cellX(i) + BOX / 2;
  const boxY = TOP;
  const W = PAD * 2 + n * BOX + Math.max(0, n - 1) * GAP;
  const H = TOP + BOX + BELOW;

  const cur = frame.markers?.find((m) => m.role === "current");
  const min = frame.markers?.find((m) => m.role === "min");
  const fg = "rgb(var(--c-fg))";
  const muted = "rgb(var(--c-muted))";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ fontFamily: "var(--font-mono)", maxWidth: "100%" }}
      role="img"
    >
      {/* profit arrow (above the boxes) */}
      {frame.arrow &&
        (() => {
          const { from, to, label, tone } = frame.arrow!;
          const col = toneColor(tone ?? "green");
          const x1 = cx(from);
          const x2 = cx(to);
          const apex = boxY - Math.min(60, 22 + Math.abs(to - from) * 9);
          const midX = (x1 + x2) / 2;
          return (
            <g style={{ transition: "opacity .3s" }}>
              <path
                d={`M ${x1} ${boxY - 2} Q ${midX} ${apex} ${x2} ${boxY - 2}`}
                fill="none"
                style={{ stroke: col, strokeWidth: 2 }}
              />
              {/* arrowhead pointing down into the sell box */}
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

      {/* cells */}
      {a.map((v, i) => {
        const tone = frame.highlights?.[i];
        const stroke = tone ? toneColor(tone) : "rgb(var(--c-border))";
        const fill = tone ? toneColor(tone) : "rgb(var(--c-bg))";
        return (
          <g key={i}>
            <rect
              x={cellX(i)}
              y={boxY}
              width={BOX}
              height={BOX}
              rx={8}
              style={{
                fill,
                fillOpacity: tone ? 0.18 : 1,
                stroke,
                strokeWidth: tone ? 2 : 1,
                transition: "fill .3s, stroke .3s, fill-opacity .3s",
              }}
            />
            {/* index label inside top-left */}
            <text
              x={cellX(i) + 6}
              y={boxY + 11}
              fontSize="8"
              style={{ fill: muted }}
            >
              {i}
            </text>
            {/* value */}
            <text
              x={cx(i)}
              y={boxY + BOX / 2 + 4}
              textAnchor="middle"
              fontSize="17"
              style={{ fill: fg }}
            >
              {String(v)}
            </text>
          </g>
        );
      })}

      {/* current pointer (above box, slides between cells) */}
      {cur && (
        <g
          style={{
            transform: `translateX(${cx(cur.index)}px)`,
            transition: "transform .35s ease",
          }}
        >
          <text
            x={0}
            y={boxY - 16}
            textAnchor="middle"
            fontSize="10"
            style={{ fill: toneColor("blue") }}
          >
            {cur.label ?? "current"}
          </text>
          <path
            d={`M -6 ${boxY - 12} L 6 ${boxY - 12} L 0 ${boxY - 3} Z`}
            style={{ fill: toneColor("blue") }}
          />
        </g>
      )}

      {/* min / buy marker (below box, slides between cells) */}
      {min && (
        <g
          style={{
            transform: `translateX(${cx(min.index)}px)`,
            transition: "transform .35s ease",
          }}
        >
          <rect
            x={-30}
            y={boxY + BOX + 8}
            width={60}
            height={17}
            rx={8}
            style={{
              fill: toneColor("yellow"),
              fillOpacity: 0.18,
              stroke: toneColor("yellow"),
            }}
          />
          <text
            x={0}
            y={boxY + BOX + 19.5}
            textAnchor="middle"
            fontSize="9"
            style={{ fill: toneColor("yellow") }}
          >
            {min.label ?? "min"}
          </text>
        </g>
      )}
    </svg>
  );
}
