import type { Frame, Visualization } from "./types";

// Two pointers from both ends, skipping non-alphanumeric characters.
export function build(s = "a,b,a"): Visualization {
  const arr = s.split("");
  const frames: Frame[] = [];
  const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
  let l = 0;
  let r = arr.length - 1;
  let result = true;

  const ptrs = (li: number, ri: number) => [
    { index: li, side: "top" as const, tone: "green" as const, label: "l" },
    { index: ri, side: "bottom" as const, tone: "blue" as const, label: "r" },
  ];

  frames.push({
    array: arr,
    pointers: ptrs(l, r),
    panel: [{ label: "result", value: "?" }],
    message:
      "Walk two pointers inward, skipping non-alphanumeric chars and comparing letters (case-insensitive).",
    row: ["—", "—", "—", "—", "start"],
  });

  while (l < r) {
    if (!isAlnum(arr[l])) {
      frames.push({
        array: arr,
        highlights: { [l]: "gray" },
        pointers: ptrs(l, r),
        panel: [
          { label: "s[l]", value: arr[l] },
          { label: "s[r]", value: arr[r] },
        ],
        message: `'${arr[l]}' is not alphanumeric — skip, l++.`,
        row: [`${l}`, `${r}`, arr[l], arr[r], "skip l"],
      });
      l++;
      continue;
    }
    if (!isAlnum(arr[r])) {
      frames.push({
        array: arr,
        highlights: { [r]: "gray" },
        pointers: ptrs(l, r),
        panel: [
          { label: "s[l]", value: arr[l] },
          { label: "s[r]", value: arr[r] },
        ],
        message: `'${arr[r]}' is not alphanumeric — skip, r--.`,
        row: [`${l}`, `${r}`, arr[l], arr[r], "skip r"],
      });
      r--;
      continue;
    }
    const match = arr[l].toLowerCase() === arr[r].toLowerCase();
    frames.push({
      array: arr,
      highlights: { [l]: match ? "green" : "red", [r]: match ? "green" : "red" },
      pointers: ptrs(l, r),
      panel: [
        { label: "s[l]", value: arr[l] },
        { label: "s[r]", value: arr[r] },
        { label: "equal?", value: match ? "yes" : "no", tone: match ? "green" : "red" },
      ],
      message: match
        ? `'${arr[l]}' == '${arr[r]}' — move both inward.`
        : `'${arr[l]}' ≠ '${arr[r]}' — not a palindrome.`,
      row: [`${l}`, `${r}`, arr[l], arr[r], match ? "match" : "mismatch"],
    });
    if (!match) {
      result = false;
      break;
    }
    l++;
    r--;
  }

  if (result) {
    frames.push({
      array: arr,
      panel: [{ label: "result", value: "true", tone: "green" }],
      message: "Pointers met without a mismatch → it's a palindrome.",
      row: ["—", "—", "—", "—", "true"],
    });
  }

  return {
    title: "Two pointers: compare ends inward, skipping punctuation",
    columns: ["l", "r", "s[l]", "s[r]", "action"],
    frames,
  };
}
