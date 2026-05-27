import type { HumanRealityObservation, HumanRealityReport } from "./types";
import { normalizeHumanRealityObservation } from "./observations";

export function buildHumanRealityReport(input: readonly HumanRealityObservation[]): HumanRealityReport {
  const observations = input.map(normalizeHumanRealityObservation);
  const creatorCount = observations.length;

  const retentionRate = ratio(observations.filter((o) => o.daysActive >= 7 || o.returnedAfterRest).length, creatorCount);
  const whisperUsefulnessRate = ratio(observations.filter((o) => o.whisperOpened && o.whisperUseful).length, observations.filter((o) => o.whisperOpened).length);
  const quietGiftAdoptionRate = ratio(observations.filter((o) => o.quietGiftSentOrReceived).length, creatorCount);
  const dreamChamberAdoptionRate = ratio(observations.filter((o) => o.dreamChamberJoined).length, creatorCount);
  const overloadRate = ratio(observations.filter((o) => o.overloadReported).length, creatorCount);
  const averageTrustScore = avg(observations.map((o) => o.trustScore));

  return {
    creatorCount,
    retentionRate,
    whisperUsefulnessRate,
    quietGiftAdoptionRate,
    dreamChamberAdoptionRate,
    overloadRate,
    averageTrustScore,
    readyForTuning: creatorCount >= 10,
    readyForExpansion:
      creatorCount >= 25 &&
      retentionRate >= 0.45 &&
      whisperUsefulnessRate >= 0.55 &&
      overloadRate <= 0.15 &&
      averageTrustScore >= 0.7
  };
}

function ratio(value: number, total: number): number {
  if (total <= 0) return 0;
  return value / total;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
