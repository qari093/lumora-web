import type { NativeFypVideo } from "../schema";
import type { SwipeSpeed } from "./intent";

export type NativePreloadMode = "thumbnail_only" | "metadata" | "first_segment";

export function buildAdaptivePreloadPlan(input: {
  queue: NativeFypVideo[];
  index: number;
  network: "wifi" | "cellular" | "data_saver";
  speed: SwipeSpeed;
}): { ids: string[]; mode: NativePreloadMode } {
  const next = input.queue[input.index + 1];

  if (!next || input.network === "data_saver" || input.speed === "rapid") {
    return { ids: [], mode: "thumbnail_only" };
  }

  if (input.network === "wifi" && input.speed === "slow") {
    return {
      ids: input.queue.slice(input.index + 1, input.index + 3).map((x) => x.id),
      mode: "first_segment",
    };
  }

  return { ids: [next.id], mode: "metadata" };
}
