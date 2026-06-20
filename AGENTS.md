# Agent notes

Blind 75 practice app — Next.js 14 (App Router) + Tailwind, InstantDB backend
(problems + per-user progress), InstantDB magic-code auth mirrored into an
httpOnly cookie. Deployed on Vercel.

## How to add an algorithm visualization for a problem

Visualizations are **trace-driven**: you write a small function that *runs the
algorithm and emits frames* (snapshots of state). A generic player renders the
frames as an SVG animation with play/step/scrub controls, a status panel, a
legend, and a static table derived from the same frames. You almost never touch
the renderer — you just write a tracer and register it.

### Steps

1. **Find the slug.** Look up the problem in `data/problems.json`; the slug
   name is the last path segment of `l_slug`
   (e.g. `https://leetcode.com/problems/two-sum/` → `two-sum`).

2. **Write a tracer** at `lib/viz/<slug>.ts` exporting
   `build(...): Visualization`. It returns `{ title, columns, frames }`. Run the
   real algorithm on a small, illustrative input (4–8 elements) and push one
   `Frame` per meaningful step, plus an intro frame and a summary frame.

3. **Register it** in `lib/viz/registry.ts`: import `build` and add
   `"<slug>": () => build()` to `REGISTRY`. That's it — the problem page shows a
   **Visualize** panel automatically when a slug is registered (see
   `app/problem/[id]/page.tsx`).

4. **Verify**: `npm run build`, then check `/problem/<pid>` (pid is the numeric
   `id` from the CSV/JSON, not the LeetCode number).

### The Frame model (see `lib/viz/types.ts`)

```ts
type Tone = "blue" | "yellow" | "green" | "gray" | "red";
// blue=current, yellow=key/min, green=good/best, gray=skipped/eliminated, red=bad
type Frame = {
  array: (number | string)[];              // the row of boxes (numbers or chars)
  highlights?: Record<number, Tone>;       // tint a cell by index
  pointers?: { index; label?; side?: "top" | "bottom"; tone? }[]; // arrows/tags; multiple allowed, stacked
  window?: { from; to; label?; tone? };    // bracket over a contiguous range (sliding window)
  dp?: { label?; values: (number|string|null)[]; highlights? }; // a 2nd row beneath (DP/aux); null = empty cell
  arrow?: { from; to; label?; tone? };     // curved arrow between two cells (e.g. buy→sell)
  panel?: { label; value; tone? }[];       // side status readout (variables)
  message?: string;                        // one-line narration for the step
  row?: (string | number)[];               // one row of the static table (must match `columns` length)
};
```

### Conventions / gotchas

- **Stage:** the only renderer today is `SequenceView` (1-D array/string). It
  supports multi-pointers, a window bracket, and a DP row, so it covers arrays,
  strings, two-pointer, sliding-window, binary-search, greedy, and 1-D DP
  patterns. Other stages (GridView, TreeView, LinkedListView, IntervalTimeline,
  GraphView) are planned but **not built** — don't reference them yet. If a
  problem needs a grid/tree/list/graph, stop and build that stage first.
- **Keep `row` length == `columns` length** for every frame, or the table
  misaligns. Use `"—"`/`""` placeholders in intro/summary rows.
- **Tones are semantic**, not decorative — follow the legend mapping above so
  the Legend component reads correctly. Colors are theme-aware (light/dark).
- **Multiple top pointers stack** by array order (e.g. `lo`, `mid`, `hi`); put
  the one you want lowest first. Use `side: "bottom"` for markers below the row.
- Keep inputs tiny and the narration plain-English; the goal is teaching, not
  covering edge cases. The static table is free, so even a modest tracer adds
  value.
- See `best-time-to-buy-and-sell-stock.ts` (arrow), `two-sum.ts` (hash-map in
  the panel), `longest-substring-without-repeating-characters.ts` (window),
  `search-in-rotated-sorted-array.ts` (binary search), and `house-robber.ts` /
  `coin-change.ts` (DP row) as worked examples.

There is a fuller roadmap/coverage map in the agent memory note
(`viz-roadmap`).
