import type {
  EmotionalTimeCapsule
} from "../capsules/types";

export type EraReconstruction = {
  reconstructionId: string;
  capsuleId: string;
  mode: string;
  contentCount: number;
  soundtrackCount: number;
  echoCount: number;
  atmosphereComplete: boolean;
};

export function reconstructEmotionalEra(
  capsule: EmotionalTimeCapsule
): EraReconstruction {
  return {
    reconstructionId: `era_${capsule.capsuleId}`,
    capsuleId: capsule.capsuleId,
    mode: capsule.mode,
    contentCount: capsule.contentIds.length,
    soundtrackCount: capsule.soundtrackIds.length,
    echoCount: capsule.echoImprintIds.length,
    atmosphereComplete:
      capsule.contentIds.length > 0 &&
      capsule.soundtrackIds.length > 0 &&
      capsule.echoImprintIds.length > 0
  };
}
