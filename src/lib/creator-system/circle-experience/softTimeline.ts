export type SoftTimelineItem = {
  videoId: string;
  order: number;
  label: string;
  active: boolean;
};

export function buildSoftTimeline(videoIds: string[], activeVideoId: string): SoftTimelineItem[] {
  return videoIds.map((videoId, index) => ({
    videoId,
    order: index + 1,
    label: `Moment ${index + 1}`,
    active: videoId === activeVideoId,
  }));
}
