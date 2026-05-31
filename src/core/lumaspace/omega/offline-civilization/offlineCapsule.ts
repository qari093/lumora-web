import type { OfflineCapsule, OfflineEntity } from "./types";

export function createOfflineCapsule(input: {
  citizenId: string;
  cachedEntities?: OfflineEntity[];
  version?: number;
}): OfflineCapsule {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  const cachedEntities = input.cachedEntities ?? ["orbit", "vault", "living_card", "community"];

  return {
    citizenId: input.citizenId,
    cachedEntities,
    version: input.version ?? 1,
    integrityHash: `${input.citizenId}:${cachedEntities.join("|")}:${input.version ?? 1}`,
    ready: cachedEntities.includes("orbit") && cachedEntities.includes("vault"),
  };
}

export function capsuleHasEntity(capsule: OfflineCapsule, entity: OfflineEntity): boolean {
  return capsule.cachedEntities.includes(entity);
}
