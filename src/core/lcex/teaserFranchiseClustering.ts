export type FranchiseClusterInput = {
  id: string;
  title: string;
  franchiseHints?: string[];
  entityIds?: string[];
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
};

export type FranchiseCluster = {
  clusterKey: string;
  franchiseLabel: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  memberIds: string[];
  entityIds: string[];
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function buildClusterKey(input: FranchiseClusterInput): string {
  const hints = (input.franchiseHints || []).map(normalize).filter(Boolean);
  if (hints.length > 0) return `${input.category}:${hints[0]}`;

  const title = normalize(input.title)
    .replace(/[:\-|].*$/g, "")
    .replace(/\b(trailer|teaser|official|preview|clip|episode|season|part)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return `${input.category}:${title}`;
}

export function createFranchiseCluster(
  input: FranchiseClusterInput
): FranchiseCluster {
  const clusterKey = buildClusterKey(input);
  const franchiseLabel = clusterKey.split(":").slice(1).join(":").trim() || input.title.trim();

  return {
    clusterKey,
    franchiseLabel,
    category: input.category,
    memberIds: [input.id],
    entityIds: [...new Set(input.entityIds || [])],
  };
}

export function mergeFranchiseClusters(
  left: FranchiseCluster,
  right: FranchiseCluster
): FranchiseCluster {
  if (left.clusterKey !== right.clusterKey) {
    throw new Error("Cannot merge franchise clusters with different keys");
  }

  return {
    clusterKey: left.clusterKey,
    franchiseLabel: left.franchiseLabel || right.franchiseLabel,
    category: left.category,
    memberIds: [...new Set([...left.memberIds, ...right.memberIds])],
    entityIds: [...new Set([...left.entityIds, ...right.entityIds])],
  };
}
