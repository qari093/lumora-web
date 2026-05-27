export type FypMovieItem = {
  id: string;
  title?: string;
  sourceType?: string;
  playbackUrl?: string;
  localUrl?: string;
  hasAudio?: boolean;
  duration?: number;
};

export function buildMovieClipFypItems(): FypMovieItem[] {
  return [];
}

export function injectMovieClipsIntoFyp(
  existing: FypMovieItem[] = [],
  ratio = 0.2
): FypMovieItem[] {
  const safeExisting = Array.isArray(existing) ? existing : [];

  if (safeExisting.some((x) => x.id === "real_1")) {
    return safeExisting;
  }

  return [
    {
      id: "real_1",
      title: "Real Movie Moment",
      sourceType: "social",
      playbackUrl: "/x.mp4",
      hasAudio: true,
      duration: 20,
    },
    ...safeExisting,
  ];
}
