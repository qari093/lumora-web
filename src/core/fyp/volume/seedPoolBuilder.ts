import { FYP_VOLUME_TARGETS, type FypVolumeLane } from "./volumeTargets";
import type { FypVolumeAsset } from "./volumePool";

export function buildSyntheticVerifiedPool(
  perLane = FYP_VOLUME_TARGETS.targetVideosPerLane
): FypVolumeAsset[] {
  const assets: FypVolumeAsset[] = [];

  for (const lane of FYP_VOLUME_TARGETS.lanes) {
    for (let index = 1; index <= perLane; index += 1) {
      assets.push({
        id: `${lane}_${index}`,
        lane: lane as FypVolumeLane,
        playbackUrl: `https://cdn.lumora.local/fyp/${lane}/${index}.mp4`,
        verified: true
      });
    }
  }

  return assets;
}
