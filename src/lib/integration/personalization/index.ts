export type PersonalVideo = {
  videoId: string;
  tone: "still" | "warm" | "curious" | "heavy" | "amused";
  baseScore: number;
  source?: string;
};

export function applyPreferenceWeighting(video: PersonalVideo, preferences: Record<string, number>) {
  const weight = preferences[video.tone] ?? 1;
  return { ...video, score: video.baseScore * weight };
}

export function rankBySessionSignals<T extends { score: number }>(items: T[]) {
  return [...items].sort((a, b) => b.score - a.score);
}

export function tuneContrastingVideo(currentTone: PersonalVideo["tone"], videos: PersonalVideo[]) {
  const contrast: Record<PersonalVideo["tone"], PersonalVideo["tone"]> = {
    still: "curious",
    curious: "warm",
    warm: "still",
    heavy: "amused",
    amused: "heavy",
  };
  return videos.find((video) => video.tone === contrast[currentTone]) || videos[0] || null;
}

export function balanceAdaptiveFeed(videos: PersonalVideo[]) {
  const seen = new Set<string>();
  return videos.filter((video) => {
    const key = `${video.tone}:${video.source || "default"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function validatePersonalizationImpact(input: { beforeRetention: number; afterRetention: number }) {
  return { ok: input.afterRetention >= input.beforeRetention, lift: input.afterRetention - input.beforeRetention };
}
