export type RuntimeCircleVideo = {
  videoId: string;
  playbackUrl: string;
  order: number;
};

export function getActiveRuntimeVideo(videos: RuntimeCircleVideo[], index: number): RuntimeCircleVideo | null {
  const ordered = [...videos].sort((a, b) => a.order - b.order);
  return ordered[index] || null;
}

export function getNextRuntimeVideoIndex(videos: RuntimeCircleVideo[], index: number): number | null {
  const nextIndex = index + 1;
  return nextIndex < videos.length ? nextIndex : null;
}
