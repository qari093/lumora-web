import type { CreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";

export interface ClusterResult {
  creatorId: string;
  constellation: string;
  confidence: number;
}

export function inferConstellationCluster(
  creatorId: string,
  events: readonly CreatorAlchemyEvent[]
): ClusterResult {
  const rewatchs = events.filter((event) => event.type === "rewatch").length;

  if (rewatchs >= 2) {
    return {
      creatorId,
      constellation: "Midnight Souls",
      confidence: 0.82
    };
  }

  return {
    creatorId,
    constellation: "Neon Dreamers",
    confidence: 0.51
  };
}
