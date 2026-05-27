export const playbackLifecycle = [
  "idle",
  "loading",
  "playing",
  "paused",
  "ended"
];

export function supportsPlaybackLifecycle() {
  return playbackLifecycle.includes("playing");
}
