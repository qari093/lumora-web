export type MovieAudioProbe = {
  hasAudioTrack?: boolean;
  audioCodec?: string;
  duration?: number;
  volumeDb?: number;
};

export function hasValidAudioTrack(probe: MovieAudioProbe): boolean {
  return probe.hasAudioTrack === true && Boolean(probe.audioCodec);
}

export function shouldRejectSilentMovieClip(probe: MovieAudioProbe): boolean {
  if (!hasValidAudioTrack(probe)) return true;
  if (typeof probe.volumeDb === "number" && probe.volumeDb < -45) return true;
  return false;
}

export function isValidMovieClipDuration(duration?: number): boolean {
  const value = Number(duration || 0);
  return value >= 10 && value <= 45;
}
