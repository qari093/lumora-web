import type { Fyp94CategoryHeat, Fyp94CrowdSignal } from "./types";

export function buildFyp94ViewerLabel(signal: Pick<Fyp94CrowdSignal, "viewerCount">): string {
  if (signal.viewerCount <= 0) return "Be first here";
  if (signal.viewerCount === 1) return "1 watching now";
  return `${signal.viewerCount} watching now`;
}

export function buildFyp94CategoryHeatLabel(heat: Fyp94CategoryHeat): string {
  if (heat.heatLevel === "high") return `🔥 ${heat.category} is heating up`;
  if (heat.heatLevel === "medium") return `${heat.category} is active now`;
  return `${heat.category} is starting`;
}
