import type { Frame, Tone, Visualization } from "./types";

// Binary search on a rotated array: one half of [lo..hi] is always sorted.
export function build(
  nums = [4, 5, 6, 7, 0, 1, 2],
  target = 0
): Visualization {
  const frames: Frame[] = [];
  let lo = 0;
  let hi = nums.length - 1;
  let found = -1;

  const grayOutside = (l: number, h: number) => {
    const hl: Record<number, Tone> = {};
    for (let k = 0; k < nums.length; k++) if (k < l || k > h) hl[k] = "gray";
    return hl;
  };
  const ptrs = (l: number, m: number, h: number) => [
    { index: l, side: "top" as const, tone: "green" as const, label: "lo" },
    { index: m, side: "top" as const, tone: "blue" as const, label: "mid" },
    { index: h, side: "bottom" as const, tone: "yellow" as const, label: "hi" },
  ];

  frames.push({
    array: nums,
    pointers: [
      { index: 0, side: "top", tone: "green", label: "lo" },
      { index: nums.length - 1, side: "bottom", tone: "yellow", label: "hi" },
    ],
    panel: [{ label: "target", value: String(target) }],
    message: `Search ${target}. One half of [lo..hi] is always sorted — pick the half that can contain the target.`,
    row: ["—", "—", "—", ""],
  });

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const hl = grayOutside(lo, hi);

    if (nums[mid] === target) {
      hl[mid] = "green";
      frames.push({
        array: nums,
        highlights: hl,
        pointers: ptrs(lo, mid, hi),
        panel: [
          { label: "lo,mid,hi", value: `${lo},${mid},${hi}` },
          { label: "nums[mid]", value: String(nums[mid]) },
          { label: "target", value: String(target) },
          { label: "found", value: `index ${mid}`, tone: "green" },
        ],
        message: `nums[${mid}] == ${target} → found at index ${mid}.`,
        row: [`${lo},${mid},${hi}`, nums[mid], target, "found!"],
      });
      found = mid;
      break;
    }

    hl[mid] = "blue";
    const leftSorted = nums[lo] <= nums[mid];
    let goRight: boolean;
    let action: string;
    if (leftSorted) {
      const inLeft = nums[lo] <= target && target < nums[mid];
      goRight = !inLeft;
      action = inLeft
        ? `left half sorted & target inside → hi = ${mid - 1}`
        : `left half sorted, target outside → lo = ${mid + 1}`;
    } else {
      const inRight = nums[mid] < target && target <= nums[hi];
      goRight = inRight;
      action = inRight
        ? `right half sorted & target inside → lo = ${mid + 1}`
        : `right half sorted, target outside → hi = ${mid - 1}`;
    }

    frames.push({
      array: nums,
      highlights: hl,
      pointers: ptrs(lo, mid, hi),
      panel: [
        { label: "lo,mid,hi", value: `${lo},${mid},${hi}` },
        { label: "nums[mid]", value: String(nums[mid]) },
        { label: "target", value: String(target) },
      ],
      message: action,
      row: [`${lo},${mid},${hi}`, nums[mid], target, goRight ? "go right" : "go left"],
    });

    if (goRight) lo = mid + 1;
    else hi = mid - 1;
  }

  if (found === -1) {
    const hl: Record<number, Tone> = {};
    for (let k = 0; k < nums.length; k++) hl[k] = "gray";
    frames.push({
      array: nums,
      highlights: hl,
      panel: [{ label: "found", value: "-1", tone: "red" }],
      message: `${target} is not in the array → return -1.`,
      row: ["—", "", "", "not found"],
    });
  }

  return {
    title: "Rotated binary search: halve the range using the sorted half",
    columns: ["lo,mid,hi", "nums[mid]", "target", "action"],
    frames,
  };
}
