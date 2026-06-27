export interface FypSeenRecord {
  assetId: string;
  seenAt: number;
}

export interface FypFreshnessAsset {
  id: string;
  publishedAt: number;
  evergreen?: boolean;
}

export interface FypFreshnessResult {
  eligible: boolean;
  reason: "fresh" | "recently_seen" | "expired";
}
