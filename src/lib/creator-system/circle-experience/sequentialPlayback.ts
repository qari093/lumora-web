export type CircleVideo = {
  videoId: string;
  creatorId: string;
  playbackUrl: string;
  order: number;
};

export function orderCircleVideos(videos: CircleVideo[]): CircleVideo[] {
  return [...videos].sort((a, b) => a.order - b.order);
}

export function getNextCircleVideo(videos: CircleVideo[], currentVideoId: string): CircleVideo | null {
  const ordered = orderCircleVideos(videos);
  const index = ordered.findIndex((video) => video.videoId === currentVideoId);
  return ordered[index + 1] || null;
}
