import type { NativeFypVideo } from "../schema";

export type PreloadPlan = {
  preloadIds: string[];
  mode: "wifi" | "cellular" | "data_saver";
};

export function buildPreloadPlan(
  queue: NativeFypVideo[],
  index: number,
  mode: PreloadPlan["mode"]
): PreloadPlan {
  if (mode === "data_saver") {
    return { preloadIds: [], mode };
  }

  if (mode === "cellular") {
    return {
      preloadIds: queue[index + 1] ? [queue[index + 1].id] : [],
      mode,
    };
  }

  // wifi
  return {
    preloadIds: queue.slice(index + 1, index + 3).map(v => v.id),
    mode,
  };
}
