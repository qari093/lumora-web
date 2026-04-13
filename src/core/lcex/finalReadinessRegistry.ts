export type FinalReadinessScope =
  | "group-a"
  | "group-b"
  | "group-c"
  | "group-d"
  | "group-e"
  | "rollout"
  | "ops"
  | "health"
  | "launch";

export type FinalReadinessStatus =
  | "pending"
  | "ready"
  | "blocked";

export type FinalReadinessRecord = {
  id: string;
  scope: FinalReadinessScope;
  title: string;
  status: FinalReadinessStatus;
  createdAt: string;
  updatedAt: string;
};

export const FINAL_READINESS_REGISTRY: FinalReadinessRecord[] = [];

export function registerFinalReadiness(
  record: FinalReadinessRecord
): void {
  FINAL_READINESS_REGISTRY.push({
    ...record,
    id: record.id.trim(),
    title: record.title.trim(),
  });
}

export function getFinalReadinessById(
  id: string
): FinalReadinessRecord | undefined {
  const normalizedId = id.trim();
  return FINAL_READINESS_REGISTRY.find((record) => record.id === normalizedId);
}

export function getReadyFinalReadinessItems(): FinalReadinessRecord[] {
  return FINAL_READINESS_REGISTRY.filter((record) => record.status === "ready");
}
