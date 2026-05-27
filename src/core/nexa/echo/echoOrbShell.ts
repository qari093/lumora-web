export const echoOrbShell = {
  position: "top-right",
  longPressAnchor: true,
  waveformPreview: true,
  workoutSoundtrackReady: true,
  breathworkSyncReady: true
} as const;

export function echoOrbHealthy(): boolean {
  return (
    echoOrbShell.position === "top-right" &&
    echoOrbShell.longPressAnchor &&
    echoOrbShell.waveformPreview &&
    echoOrbShell.workoutSoundtrackReady &&
    echoOrbShell.breathworkSyncReady
  );
}
