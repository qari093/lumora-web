export type SealScope =
  | "group-a"
  | "group-b"
  | "group-c"
  | "group-d"
  | "group-e"
  | "group-f"
  | "canonical-closeout"
  | "launch";

export type SealStatus =
  | "pending"
  | "sealed"
  | "revoked";

export type SealRecord = {
  id: string;
  scope: SealScope;
  title: string;
  status: SealStatus;
  createdAt: string;
  updatedAt: string;
};

export const SEAL_REGISTRY: SealRecord[] = [];

export function registerSeal(
  record: SealRecord
): void {
  SEAL_REGISTRY.push({
    ...record,
    id: record.id.trim(),
    title: record.title.trim(),
  });
}

export function getSealById(
  id: string
): SealRecord | undefined {
  const normalizedId = id.trim();
  return SEAL_REGISTRY.find((record) => record.id === normalizedId);
}

export function getActiveSeals(): SealRecord[] {
  return SEAL_REGISTRY.filter((record) => record.status === "sealed");
}
