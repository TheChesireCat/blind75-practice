import type { Frame, Visualization } from "./types";

// Greedy: track the furthest index reachable so far in one pass.
export function build(nums = [2, 3, 1, 1, 4]): Visualization {
  const frames: Frame[] = [];
  const n = nums.length;
  let reach = 0;
  let ok = true;

  frames.push({
    array: nums,
    window: { from: 0, to: 0, tone: "green", label: "reachable" },
    pointers: [{ index: 0, side: "top", tone: "blue", label: "i" }],
    panel: [{ label: "reach", value: "0" }],
    message:
      "Each value is a max jump length. Track the furthest index reachable; if i ever passes it, we're stuck.",
    row: ["0", nums[0], "0", "0"],
  });

  for (let i = 0; i < n; i++) {
    if (i > reach) {
      frames.push({
        array: nums,
        highlights: { [i]: "red" },
        window: { from: 0, to: reach, tone: "red", label: "reachable" },
        pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
        panel: [
          { label: "i", value: String(i) },
          { label: "reach", value: String(reach) },
          { label: "result", value: "false", tone: "red" },
        ],
        message: `i = ${i} is beyond reach = ${reach} → can't get here, return false.`,
        row: [`${i}`, nums[i], `${i}+${nums[i]}`, reach],
      });
      ok = false;
      break;
    }
    const cand = i + nums[i];
    const updated = cand > reach;
    reach = Math.max(reach, cand);
    frames.push({
      array: nums,
      highlights: { [i]: "blue" },
      window: { from: 0, to: Math.min(reach, n - 1), tone: "green", label: "reachable" },
      pointers: [{ index: i, side: "top", tone: "blue", label: "i" }],
      panel: [
        { label: "i", value: String(i) },
        { label: "nums[i]", value: String(nums[i]) },
        { label: "reach", value: String(reach), tone: "green" },
      ],
      message: updated
        ? `From i = ${i} we can reach ${cand} → extend reach to ${reach}.`
        : `i + nums[i] = ${cand} doesn't extend reach (${reach}).`,
      row: [`${i}`, nums[i], `${i}+${nums[i]}=${cand}`, reach],
    });
    if (reach >= n - 1) {
      frames.push({
        array: nums,
        highlights: { [n - 1]: "green" },
        window: { from: 0, to: n - 1, tone: "green", label: "reachable" },
        panel: [{ label: "result", value: "true", tone: "green" }],
        message: `reach = ${reach} covers the last index → return true.`,
        row: ["—", "", "", reach],
      });
      ok = true;
      break;
    }
  }

  void ok;
  return {
    title: "Greedy: keep the furthest reachable index in one pass",
    columns: ["i", "nums[i]", "i + nums[i]", "reach"],
    frames,
  };
}
