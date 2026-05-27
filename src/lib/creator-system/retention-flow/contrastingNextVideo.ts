export type VideoTone = "still" | "warm" | "curious" | "heavy" | "amused";

const CONTRAST: Record<VideoTone, VideoTone> = {
  still: "curious",
  warm: "still",
  curious: "warm",
  heavy: "amused",
  amused: "heavy",
};

export function suggestContrastingNextVideo<T extends { videoId: string; tone: VideoTone }>(
  currentTone: VideoTone,
  videos: T[],
): T | null {
  const target = CONTRAST[currentTone];
  return videos.find((video) => video.tone === target) || videos[0] || null;
}
