export const PLAYER_UX_CONTRACT = {
  autoplayMutedDefault: true,
  tapPausePlay: true,
  tapSoundToggle: true,
  realUnmuteOnInteraction: true,
  autoNextOnEnded: true,
};

export function validatePlayerUxContract(input) {
  return (
    input.autoplayMutedDefault === true &&
    input.tapPausePlay === true &&
    input.tapSoundToggle === true &&
    input.realUnmuteOnInteraction === true &&
    input.autoNextOnEnded === true
  );
}

export function buildPlayerUxState({ paused = false, muted = true, index = 0, total = 0 } = {}) {
  return {
    paused,
    muted,
    index,
    total,
    label: paused ? "Paused" : "Playing",
    soundLabel: muted ? "Tap for sound" : "Sound on",
    canAutoNext: total > 1,
  };
}
