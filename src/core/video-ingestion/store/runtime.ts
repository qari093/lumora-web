import type { CanonicalVideoAsset } from "../runtime";
import type { CanonicalVideoQuery, CanonicalVideoRecord, CanonicalVideoStoreSnapshot } from "./types";
import { canonicalVideoStore } from "./types";

export function upsertCanonicalVideo(asset: CanonicalVideoAsset): CanonicalVideoRecord {
  const store = canonicalVideoStore();
  const existing = store.get(asset.id);
  const now = new Date().toISOString();

  const record: CanonicalVideoRecord = {
    id: asset.id,
    asset,
    providerId: asset.providerId,
    insertedAt: existing?.insertedAt ?? now,
    updatedAt: now,
    version: (existing?.version ?? 0) + 1,
  };

  store.set(asset.id, record);
  return record;
}

export function getCanonicalVideo(id: string) {
  return canonicalVideoStore().get(id);
}

export function listCanonicalVideos(query: CanonicalVideoQuery = {}) {
  const limit = query.limit ?? 50;

  return [...canonicalVideoStore().values()]
    .filter((record) => !query.providerId || record.providerId === query.providerId)
    .filter((record) => !query.tags?.length || query.tags.every((tag) => record.asset.tags.includes(tag)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export function removeCanonicalVideo(id: string) {
  return canonicalVideoStore().delete(id);
}

export function clearCanonicalVideoStore() {
  canonicalVideoStore().clear();
}

export function createCanonicalVideoStoreSnapshot(): CanonicalVideoStoreSnapshot {
  const records = [...canonicalVideoStore().values()];

  return {
    total: records.length,
    providers: [...new Set(records.map((record) => record.providerId))].sort(),
    updatedAt: new Date().toISOString(),
  };
}
