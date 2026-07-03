import type { CanonicalVideoAsset } from "../runtime";

export type CanonicalVideoRecord = {
  id: string;
  asset: CanonicalVideoAsset;
  providerId: string;
  insertedAt: string;
  updatedAt: string;
  version: number;
};

export type CanonicalVideoQuery = {
  providerId?: string;
  tags?: string[];
  limit?: number;
};

export type CanonicalVideoStoreSnapshot = {
  total: number;
  providers: string[];
  updatedAt: string;
};

const records = new Map<string, CanonicalVideoRecord>();

export function canonicalVideoStore() {
  return records;
}
