export function hasNativeAudio(clip) {
  return Boolean(clip.hasAudio);
}

export function buildSoundState({ muted = true, hasAudio = false } = {}) {
  return {
    muted,
    hasAudio,
    label: muted ? "Tap for sound" : "Sound on",
    effectiveSound: !muted && hasAudio,
  };
}

export function enforceSoundPolicy(clip) {
  return {
    ...clip,
    hasAudio: Boolean(clip.hasAudio),
    allowPlayback: true,
  };
}

export function attachSoundStateToFeed(feed, muted = true) {
  return feed.map((clip) => ({
    ...clip,
    sound: buildSoundState({ muted, hasAudio: hasNativeAudio(clip) }),
  }));
}
