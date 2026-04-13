export type RightsState =
  | "safe-display"
  | "safe-embed"
  | "metadata-only"
  | "thumbnail-only"
  | "blocked"
  | "manual-review";

export type RightsGateEntry = {
  id: string;
  sourceId: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  region: string;
  state: RightsState;
  ageRestricted: boolean;
  expiresAt?: string;
  notes?: string;
};

export const RIGHTS_GATE_REGISTRY: RightsGateEntry[] = [];

export function registerRightsGate(entry: RightsGateEntry): void {
  RIGHTS_GATE_REGISTRY.push(entry);
}

export function getRightsGateForSource(
  sourceId: string,
  region: string
): RightsGateEntry | undefined {
  const normalizedRegion = region.trim().toLowerCase();
  return RIGHTS_GATE_REGISTRY.find(
    (entry) =>
      entry.sourceId === sourceId &&
      entry.region.trim().toLowerCase() === normalizedRegion
  );
}

export function getRightsStateOrDefault(
  sourceId: string,
  region: string
): RightsState {
  return getRightsGateForSource(sourceId, region)?.state ?? "manual-review";
}
