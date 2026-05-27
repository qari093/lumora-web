import type {
  LegendaryBroadcast,
  MythicRelease
} from "./types";

export function createLegendaryBroadcast(
  release: MythicRelease
): LegendaryBroadcast {
  return {
    broadcastId: `broadcast_${release.releaseId}`,
    creatorId: release.creatorId,
    reachMultiplier: 5,
    globalPlacement: true
  };
}
