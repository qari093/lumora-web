export type CanonicalCloseoutScope =
  | "contracts"
  | "guards"
  | "telemetry"
  | "summaries"
  | "locks"
  | "readiness"
  | "launch";

export type CanonicalCloseoutStatus =
  | "pending"
  | "complete"
  | "blocked";

export type CanonicalCloseoutRecord = {
  id: string;
  scope: CanonicalCloseoutScope;
  title: string;
  status: CanonicalCloseoutStatus;
  createdAt: string;
  updatedAt: string;
};

export const CANONICAL_CLOSEOUT_REGISTRY: CanonicalCloseoutRecord[] = [];

export function registerCanonicalCloseout(
  record: CanonicalCloseoutRecord
): void {
  CANONICAL_CLOSEOUT_REGISTRY.push({
    ...record,
    id: record.id.trim(),
    title: record.title.trim(),
  });
}

export function getCanonicalCloseoutById(
  id: string
): CanonicalCloseoutRecord | undefined {
  const normalizedId = id.trim();
  return CANONICAL_CLOSEOUT_REGISTRY.find((record) => record.id === normalizedId);
}

export function getCompleteCanonicalCloseouts(): CanonicalCloseoutRecord[] {
  return CANONICAL_CLOSEOUT_REGISTRY.filter((record) => record.status === "complete");
}
