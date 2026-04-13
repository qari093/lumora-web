export type PredictionPickStatus =
  | "draft"
  | "open"
  | "locked"
  | "resolved"
  | "cancelled";

export type PredictionPickCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type PredictionPickRecord = {
  id: string;
  entityId?: string;
  title: string;
  category: PredictionPickCategory;
  region?: string;
  language?: string;
  status: PredictionPickStatus;
  opensAt?: string;
  locksAt?: string;
  resolvesAt?: string;
  createdAt: string;
};

export const PREDICTION_PICK_REGISTRY: PredictionPickRecord[] = [];

export function registerPredictionPick(
  pick: PredictionPickRecord
): void {
  PREDICTION_PICK_REGISTRY.push({
    ...pick,
    id: pick.id.trim(),
    entityId: pick.entityId?.trim(),
    title: pick.title.trim(),
    region: pick.region?.trim().toLowerCase(),
    language: pick.language?.trim().toLowerCase(),
  });
}

export function getPredictionPickById(
  id: string
): PredictionPickRecord | undefined {
  const normalizedId = id.trim();
  return PREDICTION_PICK_REGISTRY.find((pick) => pick.id === normalizedId);
}

export function getOpenPredictionPicks(): PredictionPickRecord[] {
  return PREDICTION_PICK_REGISTRY
    .filter((pick) => pick.status === "open")
    .sort((a, b) => {
      const aTs = Date.parse(a.opensAt || a.createdAt);
      const bTs = Date.parse(b.opensAt || b.createdAt);
      return (Number.isNaN(aTs) ? 0 : aTs) - (Number.isNaN(bTs) ? 0 : bTs);
    });
}
