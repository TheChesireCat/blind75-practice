import type { Frame, Visualization } from "./types";

// One pass + hash map: for each number, check if its complement was seen.
export function build(nums = [2, 7, 11, 15], target = 9): Visualization {
  const frames: Frame[] = [];
  const seen = new Map<number, number>();
  const fmtSeen = () =>
    seen.size
      ? "{" + [...seen.entries()].map(([k, v]) => `${k}:${v}`).join(", ") + "}"
      : "{}";

  frames.push({
    array: nums,
    panel: [
      { label: "target", value: String(target) },
      { label: "seen", value: "{}" },
    ],
    message:
      "Scan once. For each number, check if its complement (target − num) was already seen.",
    row: ["—", "—", "—", "{}", ""],
  });

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const need = target - num;
    const j = seen.get(need);

    if (j !== undefined) {
      frames.push({
        array: nums,
        highlights: { [j]: "green", [i]: "green" },
        pointers: [
          { index: i, side: "top", tone: "blue", label: "i" },
          { index: j, side: "bottom", tone: "green", label: "complement" },
        ],
        arrow: { from: j, to: i, label: `${nums[j]}+${num}=${target}`, tone: "green" },
        panel: [
          { label: "target", value: String(target) },
          { label: "num", value: String(num) },
          { label: "need", value: String(need) },
          { label: "seen", value: fmtSeen() },
          { label: "answer", value: `[${j}, ${i}]`, tone: "green" },
        ],
        message: `need ${need} was seen at index ${j} → answer [${j}, ${i}].`,
        row: [`${i}`, num, need, fmtSeen(), `found [${j},${i}]`],
      });
      break;
    }

    frames.push({
      array: nums,
      highlights: { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      panel: [
        { label: "target", value: String(target) },
        { label: "num", value: String(num) },
        { label: "need", value: String(need) },
        { label: "seen", value: fmtSeen() },
      ],
      message: `need ${need} not in seen — remember ${num} at index ${i}.`,
      row: [`${i}`, num, need, fmtSeen(), "store"],
    });
    seen.set(num, i);
  }

  return {
    title: "Hash map: remember numbers, look up each complement in O(1)",
    columns: ["i", "num", "need", "seen (before)", "action"],
    frames,
  };
}
