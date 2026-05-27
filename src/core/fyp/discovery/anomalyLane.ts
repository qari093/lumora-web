import type { FeedItem } from "../core/types";

export type AnomalyLane = {
  laneId: string;
  items: FeedItem[];
  protected: true;
  optInRequired: true;
};

export function createAnomalyLane(input: {
  laneId: string;
  items: FeedItem[];
}): AnomalyLane {
  if (!input.laneId.trim()) {
    throw new Error("Anomaly lane requires laneId.");
  }

  return {
    laneId: input.laneId,
    items: input.items
      .filter(item => item.novelty >= 60)
      .sort((a, b) => b.novelty - a.novelty),
    protected: true,
    optInRequired: true
  };
}
