import type { RippleGraph, ShareInsight, ShareQualityMetrics } from "./types";

export function generateShareInsights(params: {
  shareId: string;
  ripple: RippleGraph;
  quality: ShareQualityMetrics;
}): ShareInsight[] {
  const insights: ShareInsight[] = [];

  if (params.quality.overallQuality >= 0.78) {
    insights.push({
      id: `insight_${params.shareId}_quality`,
      shareId: params.shareId,
      title: "High-quality share",
      detail: "This share is creating meaningful movement without excessive noise.",
      severity: "positive",
    });
  }

  if (params.ripple.totalInfluence >= 4) {
    insights.push({
      id: `insight_${params.shareId}_ripple`,
      shareId: params.shareId,
      title: "Ripple expanding",
      detail: "The share is travelling across multiple people or portals.",
      severity: "positive",
    });
  }

  if (params.quality.serenityScore < 0.62) {
    insights.push({
      id: `insight_${params.shareId}_serenity`,
      shareId: params.shareId,
      title: "Potential sharing fatigue",
      detail: "Reduce notification intensity or prefer silent delivery.",
      severity: "warning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: `insight_${params.shareId}_steady`,
      shareId: params.shareId,
      title: "Steady share",
      detail: "The share is healthy and quiet.",
      severity: "info",
    });
  }

  return insights;
}
