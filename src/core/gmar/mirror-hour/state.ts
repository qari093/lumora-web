import type { MirrorHourState } from "./types";

export function createMirrorHourState(): MirrorHourState {
  return {
    active: true,
    mood: "golden",
    competitiveSystemsPaused: true,
    skyTransitionActive: true,
    ambientAudioActive: true,
  };
}

export function mirrorHourHealthy(
  state: MirrorHourState = createMirrorHourState(),
): boolean {
  return (
    state.active &&
    state.competitiveSystemsPaused &&
    state.skyTransitionActive &&
    state.ambientAudioActive
  );
}
