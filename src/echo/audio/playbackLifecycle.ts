export const playbackLifecycle = ["idle", "loading", "playing", "paused", "ended"] as const;

export function supportsPlaybackLifecycle() {
  return playbackLifecycle.includes("playing");
}
