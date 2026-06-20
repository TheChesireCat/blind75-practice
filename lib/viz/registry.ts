import type { Visualization } from "./types";
import { slugName } from "./types";
import { build as bestTimeBuySell } from "./best-time-to-buy-and-sell-stock";
import { build as twoSum } from "./two-sum";
import { build as containsDuplicate } from "./contains-duplicate";
import { build as maximumSubarray } from "./maximum-subarray";
import { build as longestSubstring } from "./longest-substring-without-repeating-characters";
import { build as searchRotated } from "./search-in-rotated-sorted-array";
import { build as houseRobber } from "./house-robber";
import { build as validPalindrome } from "./valid-palindrome";
import { build as jumpGame } from "./jump-game";
import { build as climbingStairs } from "./climbing-stairs";
import { build as coinChange } from "./coin-change";
import { build as findMinRotated } from "./find-minimum-in-rotated-sorted-array";
import { build as maximumProductSubarray } from "./maximum-product-subarray";
import { build as longestIncreasingSubsequence } from "./longest-increasing-subsequence";
import { build as longestRepeatingReplacement } from "./longest-repeating-character-replacement";

// slug name -> builder. Adding a visualization = write a tracer + register it.
const REGISTRY: Record<string, () => Visualization> = {
  "best-time-to-buy-and-sell-stock": () => bestTimeBuySell(),
  "two-sum": () => twoSum(),
  "contains-duplicate": () => containsDuplicate(),
  "maximum-subarray": () => maximumSubarray(),
  "longest-substring-without-repeating-characters": () => longestSubstring(),
  "search-in-rotated-sorted-array": () => searchRotated(),
  "house-robber": () => houseRobber(),
  "valid-palindrome": () => validPalindrome(),
  "jump-game": () => jumpGame(),
  "climbing-stairs": () => climbingStairs(),
  "coin-change": () => coinChange(),
  "find-minimum-in-rotated-sorted-array": () => findMinRotated(),
  "maximum-product-subarray": () => maximumProductSubarray(),
  "longest-increasing-subsequence": () => longestIncreasingSubsequence(),
  "longest-repeating-character-replacement": () => longestRepeatingReplacement(),
};

export function getVisualization(slugUrl: string): Visualization | null {
  const name = slugName(slugUrl);
  const builder = REGISTRY[name];
  return builder ? builder() : null;
}
