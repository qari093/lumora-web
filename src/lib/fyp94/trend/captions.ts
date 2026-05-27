import type { Fyp94TrendMappedQuery } from "./types";

export function buildFyp94TrendCaption(mapped: Fyp94TrendMappedQuery): string {
  return mapped.caption.length > 80 ? `${mapped.caption.slice(0, 77)}...` : mapped.caption;
}

export function buildFyp94TrendStyleOverlay(mapped: Fyp94TrendMappedQuery): {
  label: string;
  intensity: "low" | "medium" | "high";
} {
  if (mapped.styleLabel === "adrenaline") {
    return { label: mapped.styleLabel, intensity: "high" };
  }

  if (mapped.styleLabel === "cinematic") {
    return { label: mapped.styleLabel, intensity: "low" };
  }

  return { label: mapped.styleLabel, intensity: "medium" };
}
