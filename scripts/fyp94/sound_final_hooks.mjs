export function buildNativeSoundCapability(clip) {
  return {
    clipId: clip.id,
    hasNativeAudio: Boolean(clip.hasAudio),
    canPlayAudio: Boolean(clip.hasAudio),
    fallbackSilent: !clip.hasAudio,
  };
}

export function markAudioAvailability(feed) {
  return feed.map((clip) => ({
    ...clip,
    audio: buildNativeSoundCapability(clip),
  }));
}

export function buildAmbientAudioHook({ enabled = false, trackUrl = "" } = {}) {
  return {
    enabled: Boolean(enabled),
    trackUrl,
    mode: "non-ai-ambient",
    ready: Boolean(enabled && trackUrl),
  };
}

export function buildSoundReadyFeed(feed, ambient = buildAmbientAudioHook()) {
  return {
    feed: markAudioAvailability(feed),
    ambient,
    policy: {
      nativeAudioPreferred: true,
      silentClipsAllowed: true,
      ambientHookPrepared: true,
      aiAudioDisabled: true,
    },
  };
}
