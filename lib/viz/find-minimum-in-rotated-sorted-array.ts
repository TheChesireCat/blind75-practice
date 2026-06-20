import type { Frame, Tone, Visualization } from "./types";

// Binary search: the minimum sits in the unsorted half. Compare mid to hi.
export function build(nums = [4, 5, 6, 7, 0, 1, 2]): Visualization {
  const frames: Frame[] = [];
  let lo = 0;
  let hi = nums.length - 1;

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
    panel: [{ label: "goal", value: "smallest value" }],
    message:
      "If nums[mid] > nums[hi], the dip (minimum) is to the right of mid; otherwise mid could be it, so keep the left half.",
    row: ["—", "—", "—", ""],
  });

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const hl = grayOutside(lo, hi);
    hl[mid] = "blue";
    const goRight = nums[mid] > nums[hi];
    const action = goRight
      ? `nums[mid]=${nums[mid]} > nums[hi]=${nums[hi]} → min is right, lo = ${mid + 1}`
      : `nums[mid]=${nums[mid]} ≤ nums[hi]=${nums[hi]} → keep left, hi = ${mid}`;
    frames.push({
      array: nums,
      highlights: hl,
      pointers: ptrs(lo, mid, hi),
      panel: [
        { label: "lo,mid,hi", value: `${lo},${mid},${hi}` },
        { label: "nums[mid]", value: String(nums[mid]) },
        { label: "nums[hi]", value: String(nums[hi]) },
      ],
      message: action,
      row: [`${lo},${mid},${hi}`, nums[mid], nums[hi], goRight ? "go right" : "go left"],
    });
    if (goRight) lo = mid + 1;
    else hi = mid;
  }

  const hl = grayOutside(lo, lo);
  hl[lo] = "green";
  frames.push({
    array: nums,
    highlights: hl,
    pointers: [{ index: lo, side: "top", tone: "green", label: "min" }],
    panel: [{ label: "minimum", value: String(nums[lo]), tone: "green" }],
    message: `lo == hi → minimum is nums[${lo}] = ${nums[lo]}.`,
    row: [`${lo}`, nums[lo], "", "min"],
  });

  return {
    title: "Binary search: the minimum lives in the unsorted half",
    columns: ["lo,mid,hi", "nums[mid]", "nums[hi]", "action"],
    frames,
  };
}
