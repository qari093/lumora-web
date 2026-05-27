import type { FeedItem } from "../core/types";

export type FeedRhythmState = {
  averageIntensity: number;
  overloadRisk: boolean;
  silenceInsertRecommended: boolean;
  nextAction: "continue" | "cool_down" | "pulse_allowed";
};

export function calculateFeedRhythm(items: FeedItem[]): FeedRhythmState {
  if (items.length === 0) {
    return {
      averageIntensity: 0,
      overloadRisk: false,
      silenceInsertRecommended: true,
      nextAction: "continue"
    };
  }

  const averageIntensity =
    items.reduce((sum, item) => sum + item.intensity, 0) / items.length;

  const overloadRisk = averageIntensity >= 8;
  const silenceInsertRecommended = averageIntensity >= 6;

  return {
    averageIntensity: Number(averageIntensity.toFixed(2)),
    overloadRisk,
    silenceInsertRecommended,
    nextAction: overloadRisk ? "cool_down" : averageIntensity >= 5 ? "pulse_allowed" : "continue"
  };
}
