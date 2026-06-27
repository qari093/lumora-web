import { FYP_VOLUME_TARGETS, type FypVolumeLane } from "./volumeTargets";

export interface FypVolumeAsset {
  id: string;
  lane: FypVolumeLane;
  playbackUrl: string;
  verified: boolean;
}

export function countVideosByLane(
  assets: FypVolumeAsset[]
): Record<FypVolumeLane, number> {
  const counts = Object.fromEntries(
    FYP_VOLUME_TARGETS.lanes.map(lane => [lane, 0])
  ) as Record<FypVolumeLane, number>;

  for (const asset of assets) {
    counts[asset.lane] += asset.verified ? 1 : 0;
  }

  return counts;
}

export function validateVolumePool(
  assets: FypVolumeAsset[]
): {
  ok: boolean;
  totalVerified: number;
  laneCounts: Record<FypVolumeLane, number>;
  missingLanes: FypVolumeLane[];
} {
  const verified = assets.filter(asset => asset.verified && asset.playbackUrl);
  const laneCounts = countVideosByLane(verified);

  const missingLanes = FYP_VOLUME_TARGETS.lanes.filter(
    lane => laneCounts[lane] < FYP_VOLUME_TARGETS.minimumVideosPerLane
  );

  return {
    ok:
      verified.length >= FYP_VOLUME_TARGETS.minimumTotalVideos &&
      missingLanes.length === 0,
    totalVerified: verified.length,
    laneCounts,
    missingLanes
  };
}
