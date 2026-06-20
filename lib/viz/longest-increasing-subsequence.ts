import type { Frame, Tone, Visualization } from "./types";

// O(n^2) DP: dp[i] = longest increasing subsequence ending at i.
export function build(nums = [10, 9, 2, 5, 3, 7, 18]): Visualization {
  const frames: Frame[] = [];
  const n = nums.length;
  const dp: (number | null)[] = Array(n).fill(null);
  let best = 0;

  frames.push({
    array: nums,
    dp: { label: "dp = LIS ending at i", values: [...dp] },
    panel: [{ label: "rule", value: "dp[i] = 1 + max(dp[j] : j<i, nums[j]<nums[i])" }],
    message:
      "dp[i] = longest increasing subsequence ending at i. Look back at every smaller earlier value and extend the best.",
    row: ["—", "—", "—", "0"],
  });

  for (let i = 0; i < n; i++) {
    dp[i] = 1;
    let bestJ = -1;
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j]! + 1 > dp[i]!) {
        dp[i] = dp[j]! + 1;
        bestJ = j;
      }
    }
    best = Math.max(best, dp[i]!);
    const dpHl: Record<number, Tone> = { [i]: "green" };
    if (bestJ >= 0) dpHl[bestJ] = "yellow";
    frames.push({
      array: nums,
      highlights: bestJ >= 0 ? { [i]: "blue", [bestJ]: "yellow" } : { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      dp: { label: "dp = LIS ending at i", values: [...dp], highlights: dpHl },
      panel: [
        { label: "nums[i]", value: String(nums[i]) },
        { label: "best j", value: bestJ >= 0 ? `${bestJ} (dp=${dp[bestJ]})` : "none" },
        { label: "dp[i]", value: String(dp[i]), tone: "green" },
        { label: "best", value: String(best), tone: "green" },
      ],
      message:
        bestJ >= 0
          ? `Extend from index ${bestJ} (nums=${nums[bestJ]}) → dp[${i}] = ${dp[i]}.`
          : `No smaller earlier value → dp[${i}] = 1.`,
      row: [`${i}`, nums[i], bestJ >= 0 ? `j=${bestJ}` : "—", String(dp[i])],
    });
  }

  frames.push({
    array: nums,
    dp: { label: "dp", values: [...dp] },
    panel: [{ label: "LIS length", value: String(best), tone: "green" }],
    message: `Longest increasing subsequence has length ${best} (max of dp).`,
    row: ["result", "", "", String(best)],
  });

  return {
    title: "DP: longest increasing subsequence ending at each index",
    columns: ["i", "nums[i]", "from j", "dp[i]"],
    frames,
  };
}
