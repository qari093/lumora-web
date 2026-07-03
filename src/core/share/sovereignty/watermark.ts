import type { CreatorRightsPolicy } from "./types";

export function createSovereigntyWatermark(policy: CreatorRightsPolicy): string {
  return `©️ ${policy.creatorId} · ${policy.objectId} · Lumora Sovereign Share`;
}

export function applySovereigntyWatermark(policy: CreatorRightsPolicy, title: string): string {
  if (!policy.watermarkRequired) return title;
  return `${title} · ${createSovereigntyWatermark(policy)}`;
}
