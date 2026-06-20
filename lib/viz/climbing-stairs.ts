import type { Frame, Tone, Visualization } from "./types";

// 1-D DP: ways(i) = ways(i-1) + ways(i-2) — Fibonacci in disguise.
export function build(n = 5): Visualization {
  const frames: Frame[] = [];
  const steps = Array.from({ length: n + 1 }, (_, i) => i);
  const dp: (number | null)[] = Array(n + 1).fill(null);

  dp[0] = 1;
  dp[1] = 1;
  frames.push({
    array: steps,
    dp: { label: "ways to reach step", values: [...dp], highlights: { 0: "green", 1: "green" } },
    panel: [{ label: "rule", value: "dp[i] = dp[i-1] + dp[i-2]" }],
    message:
      "You climb 1 or 2 steps at a time. Ways to reach step i = ways(i-1) + ways(i-2). Base: dp[0]=dp[1]=1.",
    row: ["0..1", "—", "—", "1"],
  });

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    const dpHl: Record<number, Tone> = { [i]: "green", [i - 1]: "blue", [i - 2]: "yellow" };
    frames.push({
      array: steps,
      highlights: { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      dp: { label: "ways to reach step", values: [...dp], highlights: dpHl },
      panel: [
        { label: "dp[i-1]", value: String(dp[i - 1]) },
        { label: "dp[i-2]", value: String(dp[i - 2]) },
        { label: "dp[i]", value: String(dp[i]), tone: "green" },
      ],
      message: `Step ${i}: ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} ways.`,
      row: [`${i}`, String(dp[i - 1]), String(dp[i - 2]), String(dp[i])],
    });
  }

  frames.push({
    array: steps,
    dp: { label: "ways", values: [...dp], highlights: { [n]: "green" } },
    panel: [{ label: "ways", value: String(dp[n]), tone: "green" }],
    message: `There are ${dp[n]} distinct ways to climb ${n} steps.`,
    row: ["result", "", "", String(dp[n])],
  });

  return {
    title: "1-D DP: ways(i) = ways(i-1) + ways(i-2)",
    columns: ["step i", "dp[i-1]", "dp[i-2]", "ways dp[i]"],
    frames,
  };
}
