import type { WitnessDepth } from "./depthTracker";

export function getWitnessThreadTone(depth: WitnessDepth): string {
  if (depth.depthLevel === "deep") return "has stayed through many quiet rooms";
  if (depth.depthLevel === "familiar") return "has been still with you often";
  if (depth.depthLevel === "returning") return "has returned to your circle";

  return "a first quiet presence";
}
