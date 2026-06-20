import type { Frame, Tone, Visualization } from "./types";

// Sliding window: grow the right edge; when a char repeats, shrink from left.
export function build(s = "abcabcbb"): Visualization {
  const arr = s.split("");
  const frames: Frame[] = [];
  const seen = new Set<string>();
  let left = 0;
  let best = 0;
  let bestL = 0;
  let bestR = 0;
  const win = (l: number, r: number) => arr.slice(l, r + 1).join("");

  frames.push({
    array: arr,
    panel: [
      { label: "window", value: '""' },
      { label: "max_len", value: "0", tone: "green" },
    ],
    message:
      "Grow the window to the right. If a character repeats, shrink from the left until it's unique again.",
    row: ["—", "—", "", "0"],
  });

  for (let right = 0; right < arr.length; right++) {
    const c = arr[right];

    while (seen.has(c)) {
      frames.push({
        array: arr,
        window: { from: left, to: right, tone: "red", label: "shrinking" },
        pointers: [
          { index: left, side: "bottom", tone: "red", label: "left" },
          { index: right, side: "top", tone: "blue", label: "right" },
        ],
        highlights: { [left]: "red" },
        panel: [
          { label: "char", value: c },
          { label: "window", value: `"${win(left, right - 1)}"` },
          { label: "max_len", value: String(best), tone: "green" },
        ],
        message: `'${c}' is already in the window — drop '${arr[left]}' and advance left.`,
        row: [`${right}`, c, `"${win(left, right - 1)}"`, best],
      });
      seen.delete(arr[left]);
      left++;
    }

    seen.add(c);
    const len = right - left + 1;
    let msg = `Add '${c}' → window "${win(left, right)}" (length ${len}).`;
    if (len > best) {
      best = len;
      bestL = left;
      bestR = right;
      msg += " New longest!";
    }
    const highlights: Record<number, Tone> = {};
    for (let k = left; k <= right; k++) highlights[k] = "blue";
    frames.push({
      array: arr,
      window: { from: left, to: right, tone: "blue", label: `len ${len}` },
      pointers: [
        { index: left, side: "bottom", tone: "yellow", label: "left" },
        { index: right, side: "top", tone: "blue", label: "right" },
      ],
      highlights,
      panel: [
        { label: "char", value: c },
        { label: "window", value: `"${win(left, right)}"` },
        { label: "length", value: String(len) },
        { label: "max_len", value: String(best), tone: "green" },
      ],
      message: msg,
      row: [`${right}`, c, `"${win(left, right)}"`, best],
    });
  }

  const highlights: Record<number, Tone> = {};
  for (let k = bestL; k <= bestR; k++) highlights[k] = "green";
  frames.push({
    array: arr,
    highlights,
    window: { from: bestL, to: bestR, tone: "green", label: "longest" },
    panel: [{ label: "max_len", value: String(best), tone: "green" }],
    message: `Longest substring without repeats: "${win(bestL, bestR)}" (length ${best}).`,
    row: ["result", "", "", best],
  });

  return {
    title: "Sliding window: keep a window of unique characters",
    columns: ["right", "char", "window", "max_len"],
    frames,
  };
}
