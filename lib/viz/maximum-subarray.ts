import type { Frame, Tone, Visualization } from "./types";

// Kadane's algorithm: extend the running sum or restart at the current value.
export function build(nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]): Visualization {
  const frames: Frame[] = [];
  let cur = nums[0];
  let best = nums[0];
  let runStart = 0;
  let bestL = 0;
  let bestR = 0;

  frames.push({
    array: nums,
    window: { from: 0, to: 0, tone: "blue", label: "current run" },
    pointers: [{ index: 0, side: "top", tone: "blue", label: "i" }],
    highlights: { 0: "blue" },
    panel: [
      { label: "cur_sum", value: String(cur) },
      { label: "max_sum", value: String(best), tone: "green" },
    ],
    message:
      "Extend the current run, or restart it at i if the run turned negative. Track the best sum seen.",
    row: ["0", nums[0], cur, best],
  });

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    let msg: string;
    if (cur + num < num) {
      cur = num;
      runStart = i;
      msg = `Previous run hurts — restart current run at ${num}.`;
    } else {
      cur = cur + num;
      msg = `Extend run → cur_sum = ${cur}.`;
    }
    if (cur > best) {
      best = cur;
      bestL = runStart;
      bestR = i;
      msg += " New best!";
    }
    const highlights: Record<number, Tone> = {};
    for (let k = bestL; k <= bestR; k++) highlights[k] = "green";
    highlights[i] = "blue";
    frames.push({
      array: nums,
      window: { from: runStart, to: i, tone: "blue", label: "current run" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      highlights,
      panel: [
        { label: "num", value: String(num) },
        { label: "cur_sum", value: String(cur) },
        { label: "max_sum", value: String(best), tone: "green" },
      ],
      message: msg,
      row: [`${i}`, num, cur, best],
    });
  }

  const highlights: Record<number, Tone> = {};
  for (let k = bestL; k <= bestR; k++) highlights[k] = "green";
  frames.push({
    array: nums,
    highlights,
    window: { from: bestL, to: bestR, tone: "green", label: "max subarray" },
    panel: [{ label: "max_sum", value: String(best), tone: "green" }],
    message: `Largest sum is ${best} (indices ${bestL}..${bestR}).`,
    row: ["result", "", "", best],
  });

  return {
    title: "Kadane: extend or restart the running sum, keep the best",
    columns: ["i", "num", "cur_sum", "max_sum"],
    frames,
  };
}
