import type { Frame, Visualization } from "./types";

// Single left-to-right scan: remember the lowest price so far (min_price)
// and the best profit so far (max_profit).
export function build(prices: number[] = [7, 1, 5, 3, 6, 4]): Visualization {
  const frames: Frame[] = [];
  let minPrice = Infinity;
  let minIdx = -1;
  let maxProfit = 0;
  let bestBuy = -1;
  let bestSell = -1;

  const fmt = (n: number) => (isFinite(n) ? String(n) : "∞");

  frames.push({
    array: prices,
    panel: [
      { label: "min_price", value: "∞" },
      { label: "max_profit", value: "0", tone: "green" },
    ],
    message: "Scan left → right, remembering the cheapest price and best profit so far.",
    row: ["—", "—", "∞", "—", "0"],
  });

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    const highlights: Frame["highlights"] = { [i]: "blue" };
    let arrow: Frame["arrow"];
    let message: string;
    let profitToday = 0;

    if (price < minPrice) {
      minPrice = price;
      minIdx = i;
      highlights[i] = "yellow";
      message = "Cheaper than any earlier day — a better day to buy.";
    } else {
      profitToday = price - minPrice;
      if (profitToday > maxProfit) {
        maxProfit = profitToday;
        bestBuy = minIdx;
        bestSell = i;
        highlights[i] = "green";
        if (minIdx >= 0) highlights[minIdx] = "yellow";
        arrow = { from: minIdx, to: i, label: `+${profitToday}`, tone: "green" };
        message = "Buy at the cheapest day, sell today → new best profit!";
      } else {
        highlights[i] = "gray";
        if (minIdx >= 0) highlights[minIdx] = "yellow";
        arrow = { from: minIdx, to: i, label: `+${profitToday}`, tone: "gray" };
        message = "Valid profit, but not better than the best so far.";
      }
    }

    frames.push({
      array: prices,
      highlights,
      markers: [
        { index: i, role: "current", label: "current" },
        ...(minIdx >= 0 ? [{ index: minIdx, role: "min" as const, label: "min / buy" }] : []),
      ],
      arrow,
      panel: [
        { label: "min_price", value: fmt(minPrice) },
        { label: "price[i]", value: String(price) },
        { label: "profit if sold today", value: String(Math.max(profitToday, 0)) },
        { label: "max_profit", value: String(maxProfit), tone: "green" },
      ],
      message,
      row: [`d${i}`, price, fmt(minPrice), Math.max(profitToday, 0), maxProfit],
    });
  }

  // Final summary frame.
  const summary: Frame = {
    array: prices,
    highlights:
      bestBuy >= 0
        ? { [bestBuy]: "yellow", [bestSell]: "green" }
        : {},
    markers:
      bestBuy >= 0
        ? [
            { index: bestBuy, role: "min", label: "buy" },
            { index: bestSell, role: "current", label: "sell" },
          ]
        : [],
    arrow:
      bestBuy >= 0
        ? { from: bestBuy, to: bestSell, label: `+${maxProfit}`, tone: "green" }
        : undefined,
    panel: [{ label: "max_profit", value: String(maxProfit), tone: "green" }],
    message:
      maxProfit > 0
        ? `Buy at ${prices[bestBuy]} (d${bestBuy}), sell at ${prices[bestSell]} (d${bestSell}) → profit ${maxProfit}.`
        : "Prices only fall — no profitable transaction, answer is 0.",
    row: ["result", "", "", "", maxProfit],
  };
  frames.push(summary);

  return {
    title: "One scan: cheapest buy so far + best profit so far",
    columns: ["Day", "Price", "Min so far", "Profit if sold", "Max profit"],
    frames,
  };
}
