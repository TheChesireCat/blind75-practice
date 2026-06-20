import type { Frame, Tone, Visualization } from "./types";

// 1-D DP: at each house, skip it (dp[i-1]) or rob it (dp[i-2] + nums[i]).
export function build(nums = [2, 7, 9, 3, 1]): Visualization {
  const frames: Frame[] = [];
  const n = nums.length;
  const dp: (number | null)[] = Array(n).fill(null);

  frames.push({
    array: nums,
    dp: { label: "dp (best loot up to house i)", values: [...dp] },
    panel: [{ label: "rule", value: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])" }],
    message:
      "At each house: skip it (keep dp[i-1]) or rob it (dp[i-2] + nums[i]). Take the larger.",
    row: ["—", "—", "—", "—", "—"],
  });

  for (let i = 0; i < n; i++) {
    const skip = i >= 1 ? dp[i - 1]! : 0;
    const rob = nums[i] + (i >= 2 ? dp[i - 2]! : 0);
    dp[i] = Math.max(skip, rob);

    const dpHl: Record<number, Tone> = { [i]: "green" };
    if (i >= 1) dpHl[i - 1] = "blue";
    if (i >= 2) dpHl[i - 2] = "yellow";

    frames.push({
      array: nums,
      highlights: { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      dp: { label: "dp (best loot up to house i)", values: [...dp], highlights: dpHl },
      panel: [
        { label: "skip = dp[i-1]", value: String(skip) },
        { label: "rob = dp[i-2]+nums[i]", value: String(rob) },
        { label: "dp[i]", value: String(dp[i]), tone: "green" },
      ],
      message: `House ${i}: skip→${skip}, rob→${rob}. dp[${i}] = ${dp[i]}.`,
      row: [`${i}`, nums[i], skip, rob, dp[i]!],
    });
  }

  frames.push({
    array: nums,
    dp: { label: "dp", values: [...dp], highlights: { [n - 1]: "green" } },
    panel: [{ label: "max_robbed", value: String(dp[n - 1]), tone: "green" }],
    message: `Most money without robbing adjacent houses: ${dp[n - 1]}.`,
    row: ["result", "", "", "", dp[n - 1]!],
  });

  return {
    title: "1-D DP: at each house, skip (dp[i-1]) or rob (dp[i-2] + nums[i])",
    columns: ["i", "nums[i]", "skip = dp[i-1]", "rob", "dp[i]"],
    frames,
  };
}
