export type TrendClusterCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type TrendCluster = {
  id: string;
  label: string;
  category: TrendClusterCategory;
  entityIds: string[];
  sourceIds: string[];
  trendScore: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
};

export function createTrendCluster(input: {
  id: string;
  label: string;
  category: TrendClusterCategory;
  entityIds?: string[];
  sourceIds?: string[];
  trendScore?: number;
  confidenceScore?: number;
  createdAt?: string;
  updatedAt?: string;
}): TrendCluster {
  const now = new Date().toISOString();

  return {
    id: input.id,
    label: input.label.trim(),
    category: input.category,
    entityIds: [...new Set((input.entityIds ?? []).filter(Boolean))],
    sourceIds: [...new Set((input.sourceIds ?? []).filter(Boolean))],
    trendScore: input.trendScore ?? 0,
    confidenceScore: input.confidenceScore ?? 0,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function mergeTrendClusters(
  base: TrendCluster,
  incoming: TrendCluster
): TrendCluster {
  return {
    ...base,
    label: incoming.label || base.label,
    category: incoming.category,
    entityIds: [...new Set([...base.entityIds, ...incoming.entityIds])],
    sourceIds: [...new Set([...base.sourceIds, ...incoming.sourceIds])],
    trendScore: Math.max(base.trendScore, incoming.trendScore),
    confidenceScore: Math.max(base.confidenceScore, incoming.confidenceScore),
    updatedAt: incoming.updatedAt,
  };
}

export function isValidTrendCluster(value: unknown): value is TrendCluster {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.label === "string" &&
    typeof v.trendScore === "number" &&
    typeof v.confidenceScore === "number" &&
    typeof v.createdAt === "string" &&
    typeof v.updatedAt === "string"
  );
}
