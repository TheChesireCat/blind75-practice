import type { Frame, Visualization } from "./types";

// Add each number to a set; the first number already present is a duplicate.
export function build(nums = [1, 2, 3, 1]): Visualization {
  const frames: Frame[] = [];
  const seen = new Set<number>();
  const fmt = () => (seen.size ? "{" + [...seen].join(", ") + "}" : "{}");

  frames.push({
    array: nums,
    panel: [{ label: "seen", value: "{}" }],
    message:
      "Add each number to a set. If one is already in the set, we found a duplicate.",
    row: ["—", "—", "{}", ""],
  });

  let found = false;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (seen.has(num)) {
      const first = nums.indexOf(num);
      frames.push({
        array: nums,
        highlights: { [first]: "red", [i]: "red" },
        pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
        panel: [
          { label: "num", value: String(num) },
          { label: "seen", value: fmt() },
          { label: "result", value: "true", tone: "red" },
        ],
        message: `${num} is already in the set → duplicate, return true.`,
        row: [`${i}`, num, fmt(), "duplicate!"],
      });
      found = true;
      break;
    }
    frames.push({
      array: nums,
      highlights: { [i]: "blue" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      panel: [
        { label: "num", value: String(num) },
        { label: "seen", value: fmt() },
      ],
      message: `${num} not seen yet — add it.`,
      row: [`${i}`, num, fmt(), "add"],
    });
    seen.add(num);
  }

  if (!found) {
    frames.push({
      array: nums,
      panel: [{ label: "result", value: "false", tone: "green" }],
      message: "Reached the end with no repeats → return false.",
      row: ["end", "", "", "no duplicate"],
    });
  }

  return {
    title: "Hash set: the first repeat means a duplicate exists",
    columns: ["i", "num", "seen (before)", "action"],
    frames,
  };
}
