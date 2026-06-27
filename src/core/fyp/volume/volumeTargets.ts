export const FYP_VOLUME_TARGETS = {
  minimumTotalVideos: 1500,
  minimumVideosPerLane: 100,
  targetVideosPerLane: 250,
  lanes: ["wonder", "learn", "laugh", "build", "reflect", "connect"] as const
};

export type FypVolumeLane = typeof FYP_VOLUME_TARGETS.lanes[number];
