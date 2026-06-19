import raw from "@/data/problems.json";

export type Problem = {
  pid: number;
  no: number;
  type: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  solution: string;
};

export const PROBLEMS = raw as Problem[];

// Display order for the categories (Blind 75 grouping).
export const CATEGORY_ORDER = [
  "Array",
  "Binary",
  "String",
  "Matrix",
  "Linked List",
  "Tree",
  "Heap",
  "Interval",
  "Graph",
  "DP",
];

export function sortByCategory(a: string, b: string): number {
  const ia = CATEGORY_ORDER.indexOf(a);
  const ib = CATEGORY_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

export const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};
