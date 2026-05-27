import type { HumanRealityReport } from "./types";

export interface HumanRealityTuningPlan {
  tuneWhispers: boolean;
  tuneDreamChamber: boolean;
  tuneQuietGifts: boolean;
  tuneOverloadProtection: boolean;
  expandBeta: boolean;
}

export function decideHumanRealityTuning(report: HumanRealityReport): HumanRealityTuningPlan {
  return {
    tuneWhispers: report.whisperUsefulnessRate < 0.55,
    tuneDreamChamber: report.dreamChamberAdoptionRate < 0.2,
    tuneQuietGifts: report.quietGiftAdoptionRate < 0.2,
    tuneOverloadProtection: report.overloadRate > 0.15,
    expandBeta: report.readyForExpansion
  };
}
