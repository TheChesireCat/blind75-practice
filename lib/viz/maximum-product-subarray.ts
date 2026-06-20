import type { Frame, Visualization } from "./types";

// Track both the running max AND min product — a negative flips them.
export function build(nums = [2, 3, -2, 4, -1]): Visualization {
  const frames: Frame[] = [];
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];

  frames.push({
    array: nums,
    highlights: { 0: "blue" },
    pointers: [{ index: 0, side: "top", tone: "blue", label: "i" }],
    panel: [
      { label: "cur_max", value: String(curMax) },
      { label: "cur_min", value: String(curMin) },
      { label: "best", value: String(best), tone: "green" },
    ],
    message:
      "Keep a running max and min product — a negative number swaps them, so the min can become the max.",
    row: ["0", nums[0], curMax, curMin, best],
  });

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const cands = [num, num * curMax, num * curMin];
    const nextMax = Math.max(...cands);
    const nextMin = Math.min(...cands);
    curMax = nextMax;
    curMin = nextMin;
    const updated = curMax > best;
    best = Math.max(best, curMax);
    frames.push({
      array: nums,
      highlights: { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      panel: [
        { label: "num", value: String(num) },
        { label: "cur_max", value: String(curMax) },
        { label: "cur_min", value: String(curMin) },
        { label: "best", value: String(best), tone: "green" },
      ],
      message:
        num < 0
          ? `${num} is negative — max/min swap. cur_max=${curMax}, cur_min=${curMin}.${updated ? " New best!" : ""}`
          : `cur_max=${curMax}, cur_min=${curMin}.${updated ? " New best!" : ""}`,
      row: [`${i}`, num, curMax, curMin, best],
    });
  }

  frames.push({
    array: nums,
    panel: [{ label: "max_product", value: String(best), tone: "green" }],
    message: `Largest product of a contiguous subarray is ${best}.`,
    row: ["result", "", "", "", best],
  });

  return {
    title: "Track running max & min (negatives flip them)",
    columns: ["i", "num", "cur_max", "cur_min", "best"],
    frames,
  };
}
