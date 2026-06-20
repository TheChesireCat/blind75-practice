import type { Frame, Tone, Visualization } from "./types";

// Sliding window: valid while (window length − count of most frequent char) <= k.
export function build(s = "AABABBA", k = 1): Visualization {
  const arr = s.split("");
  const frames: Frame[] = [];
  const count: Record<string, number> = {};
  let left = 0;
  let maxFreq = 0;
  let best = 0;
  let bestL = 0;
  let bestR = 0;
  const win = (l: number, r: number) => arr.slice(l, r + 1).join("");
  const fmt = () =>
    "{" +
    Object.entries(count)
      .filter(([, v]) => v > 0)
      .map(([c, v]) => `${c}:${v}`)
      .join(", ") +
    "}";

  frames.push({
    array: arr,
    panel: [
      { label: "k (replacements)", value: String(k) },
      { label: "max_len", value: "0", tone: "green" },
    ],
    message: `Grow a window; it's valid while (length − most-frequent count) ≤ k = ${k}. Otherwise shrink from the left.`,
    row: ["—", "—", "—", "0"],
  });

  for (let right = 0; right < arr.length; right++) {
    const c = arr[right];
    count[c] = (count[c] ?? 0) + 1;
    maxFreq = Math.max(maxFreq, count[c]);

    if (right - left + 1 - maxFreq > k) {
      frames.push({
        array: arr,
        window: { from: left, to: right, tone: "red", label: "too many to replace" },
        pointers: [
          { index: left, side: "bottom", tone: "red", label: "left" },
          { index: right, side: "top", tone: "blue", label: "right" },
        ],
        highlights: { [left]: "red" },
        panel: [
          { label: "window", value: `"${win(left, right)}"` },
          { label: "need to replace", value: String(right - left + 1 - maxFreq) },
          { label: "k", value: String(k) },
        ],
        message: `Replacements needed (${right - left + 1 - maxFreq}) > k — drop '${arr[left]}', advance left.`,
        row: [`${right}`, c, `"${win(left, right)}"`, best],
      });
      count[arr[left]]--;
      left++;
    }

    const len = right - left + 1;
    let msg = `Window "${win(left, right)}": replace ${len - maxFreq} of ${len} to match the most frequent char.`;
    if (len > best) {
      best = len;
      bestL = left;
      bestR = right;
      msg += " New longest!";
    }
    const highlights: Record<number, Tone> = {};
    for (let kk = left; kk <= right; kk++) highlights[kk] = "blue";
    frames.push({
      array: arr,
      window: { from: left, to: right, tone: "blue", label: `len ${len}` },
      pointers: [
        { index: left, side: "bottom", tone: "yellow", label: "left" },
        { index: right, side: "top", tone: "blue", label: "right" },
      ],
      highlights,
      panel: [
        { label: "counts", value: fmt() },
        { label: "max_freq", value: String(maxFreq) },
        { label: "replace", value: String(len - maxFreq) },
        { label: "max_len", value: String(best), tone: "green" },
      ],
      message: msg,
      row: [`${right}`, c, `"${win(left, right)}"`, best],
    });
  }

  const highlights: Record<number, Tone> = {};
  for (let kk = bestL; kk <= bestR; kk++) highlights[kk] = "green";
  frames.push({
    array: arr,
    highlights,
    window: { from: bestL, to: bestR, tone: "green", label: "longest" },
    panel: [{ label: "max_len", value: String(best), tone: "green" }],
    message: `Longest window needing ≤ ${k} replacements: "${win(bestL, bestR)}" (length ${best}).`,
    row: ["result", "", "", best],
  });

  return {
    title: "Sliding window: valid while (len − max_freq) ≤ k",
    columns: ["right", "char", "window", "max_len"],
    frames,
  };
}
