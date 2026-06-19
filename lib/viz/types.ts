// A trace-driven visualization framework.
//
// Per-problem code only has to *run the algorithm and emit frames*; the
// generic <AlgoVisualizer> renders any frame list (boxes, pointers, arrows,
// status panel, message) and derives the static table from the same frames.

export type Tone = "blue" | "yellow" | "green" | "gray" | "red";

export type Marker = {
  index: number;
  role: "current" | "min"; // pointer above (current) / tag below (min/buy)
  label?: string;
};

export type Frame = {
  array: (number | string)[];
  /** per-cell background tint by index */
  highlights?: Record<number, Tone>;
  markers?: Marker[];
  /** curved arrow between two cells, e.g. buy -> sell */
  arrow?: { from: number; to: number; label?: string; tone?: Tone };
  /** side status panel rows */
  panel?: { label: string; value: string; tone?: Tone }[];
  message?: string;
  /** one row of the static table (aligned with `columns`) */
  row?: (string | number)[];
};

export type Visualization = {
  title: string;
  /** column headers for the static table */
  columns: string[];
  frames: Frame[];
};

/** Extract the leetcode slug name from the stored URL. */
export function slugName(url: string): string {
  const m = url.match(/problems\/([^/]+)/);
  return m ? m[1] : "";
}
