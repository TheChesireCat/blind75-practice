import type { Frame, Tone, Visualization } from "./types";

// Bottom-up DP over amounts: dp[a] = fewest coins to make amount a.
export function build(coins = [1, 2, 5], amount = 6): Visualization {
  const frames: Frame[] = [];
  const amounts = Array.from({ length: amount + 1 }, (_, a) => a);
  const INF = Infinity;
  const dp = Array(amount + 1).fill(INF);
  dp[0] = 0;

  // dp display up to the amount computed so far (∞ = unreachable, null = future)
  const show = (upto: number): (number | string | null)[] =>
    amounts.map((a) => (a > upto ? null : dp[a] === INF ? "∞" : dp[a]));

  frames.push({
    array: amounts,
    dp: { label: "dp = fewest coins", values: show(0), highlights: { 0: "green" } },
    panel: [
      { label: "coins", value: `[${coins.join(", ")}]` },
      { label: "rule", value: "dp[a] = min(dp[a-coin] + 1)" },
    ],
    message:
      "Build up every amount. dp[a] = min over coins of dp[a-coin] + 1. Base: dp[0] = 0.",
    row: ["0", "—", "—", "0"],
  });

  for (let a = 1; a <= amount; a++) {
    let bestCoin = -1;
    let from = -1;
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1;
        bestCoin = c;
        from = a - c;
      }
    }
    const dpHl: Record<number, Tone> = { [a]: dp[a] === INF ? "red" : "green" };
    if (from >= 0) dpHl[from] = "yellow";
    frames.push({
      array: amounts,
      highlights: { [a]: "blue" },
      pointers: [{ index: a, side: "top", tone: "blue", label: "a" }],
      dp: { label: "dp = fewest coins", values: show(a), highlights: dpHl },
      panel: [
        { label: "amount", value: String(a) },
        { label: "best coin", value: bestCoin > 0 ? String(bestCoin) : "—" },
        { label: "dp[a]", value: dp[a] === INF ? "∞" : String(dp[a]), tone: dp[a] === INF ? "red" : "green" },
      ],
      message:
        bestCoin > 0
          ? `Amount ${a}: use coin ${bestCoin} → dp[${from}] + 1 = ${dp[a]}.`
          : `Amount ${a}: no coin fits → still unreachable (∞).`,
      row: [`${a}`, bestCoin > 0 ? bestCoin : "—", from >= 0 ? `dp[${from}]+1` : "—", dp[a] === INF ? "∞" : dp[a]],
    });
  }

  frames.push({
    array: amounts,
    dp: { label: "dp", values: show(amount), highlights: { [amount]: dp[amount] === INF ? "red" : "green" } },
    panel: [
      {
        label: "answer",
        value: dp[amount] === INF ? "-1" : String(dp[amount]),
        tone: dp[amount] === INF ? "red" : "green",
      },
    ],
    message:
      dp[amount] === INF
        ? `Amount ${amount} can't be formed → return -1.`
        : `Fewest coins for ${amount} is ${dp[amount]}.`,
    row: ["result", "", "", dp[amount] === INF ? "-1" : dp[amount]],
  });

  return {
    title: "Bottom-up DP: dp[a] = min(dp[a − coin] + 1) over coins",
    columns: ["amount a", "coin", "via", "dp[a]"],
    frames,
  };
}
