export function buildPresenceAudioCue(enabled: boolean) {
  return {
    enabled,
    cue: enabled ? "soft_chime" : null,
    userDisableable: true,
  };
}
