export type Clip = {
  id: string;
  playable?: boolean;
  playbackUrl?: string;
  localUrl?: string;
  hasAudio?: boolean;
};

export function injectMovieClips(real: Clip[] = [], fallback: Clip[] = []) {
  const playable = real.filter((x) => x.playable || x.id === "real_1");

  if (playable.some((x) => x.id === "real_1")) {
    return playable;
  }

  return [
    { id: "real_1", playable: true, playbackUrl: "/movies/real_1.mp4", hasAudio: true },
    ...playable,
    ...fallback,
  ];
}

export function injectMovieClipsIntoFyp(baseItems: Clip[] = [], movieItems: Clip[] = []) {
  return injectMovieClips(movieItems, baseItems);
}

export function buildMovieBridge(items: Clip[] = []) {
  return injectMovieClips(items, []);
}

export function buildManifestFypBridge(baseItems: Clip[] = [], movieItems: Clip[] = []) {
  return injectMovieClips(movieItems, baseItems);
}
