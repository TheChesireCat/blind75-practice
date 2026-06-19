import type { Visualization } from "./types";
import { slugName } from "./types";
import { build as bestTimeBuySell } from "./best-time-to-buy-and-sell-stock";

// slug name -> builder. Adding a visualization = write a tracer + register it.
const REGISTRY: Record<string, () => Visualization> = {
  "best-time-to-buy-and-sell-stock": () => bestTimeBuySell(),
};

export function getVisualization(slugUrl: string): Visualization | null {
  const name = slugName(slugUrl);
  const builder = REGISTRY[name];
  return builder ? builder() : null;
}
