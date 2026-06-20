// A trace-driven visualization framework.
//
// Per-problem code only has to *run the algorithm and emit frames*; the
// generic <AlgoVisualizer> renders any frame list (boxes, pointers, window,
// dp row, arrow, status panel, message) and derives the static table.

export type Tone = "blue" | "yellow" | "green" | "gray" | "red";

export type Pointer = {
  index: number;
  label?: string;
  /** "top" draws an arrow above the row, "bottom" a tag below. default top */
  side?: "top" | "bottom";
  tone?: Tone; // default blue
};

/** A second row of computed values rendered beneath the main array. */
export type DpRow = {
  label?: string;
  values: (number | string | null)[];
  highlights?: Record<number, Tone>;
};

export type Frame = {
  array: (number | string)[];
  /** per-cell background tint by index */
  highlights?: Record<number, Tone>;
  pointers?: Pointer[];
  /** highlighted contiguous range [from..to], e.g. a sliding window */
  window?: { from: number; to: number; label?: string; tone?: Tone };
  dp?: DpRow;
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
  columns: string[];
  frames: Frame[];
};

/** Extract the leetcode slug name from the stored URL. */
export function slugName(url: string): string {
  const m = url.match(/problems\/([^/]+)/);
  return m ? m[1] : "";
}
