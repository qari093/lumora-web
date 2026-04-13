export type TopImpactCluster = {
  id: string;
  title: string;
  trendScore: number;
  confidenceScore: number;
  culturalRiskScore: number;
  rightsRiskScore: number;
  reachScore: number;
  createdAt: string;
};

export type TopImpactClusterTriageResult = {
  clusterId: string;
  priority: "normal" | "high" | "critical";
  requiresOpsReview: boolean;
  reason: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeTopImpactClusterScore(
  cluster: TopImpactCluster
): number {
  return clampScore(
    cluster.trendScore * 0.3 +
      cluster.confidenceScore * 0.2 +
      cluster.reachScore * 0.3 +
      cluster.culturalRiskScore * 0.1 +
      cluster.rightsRiskScore * 0.1
  );
}

export function triageTopImpactCluster(
  cluster: TopImpactCluster
): TopImpactClusterTriageResult {
  const impactScore = computeTopImpactClusterScore(cluster);
  const riskScore = clampScore(
    cluster.culturalRiskScore * 0.6 + cluster.rightsRiskScore * 0.4
  );

  if (impactScore >= 85 && riskScore >= 65) {
    return {
      clusterId: cluster.id,
      priority: "critical",
      requiresOpsReview: true,
      reason: "High-impact cluster with elevated risk requires immediate ops triage.",
    };
  }

  if (impactScore >= 70 || riskScore >= 55) {
    return {
      clusterId: cluster.id,
      priority: "high",
      requiresOpsReview: true,
      reason: "High-impact or moderate-risk cluster requires ops review.",
    };
  }

  return {
    clusterId: cluster.id,
    priority: "normal",
    requiresOpsReview: false,
    reason: "Cluster can remain in standard automated flow.",
  };
}
