export function createResonanceWave() {
  return {
    wave: true,
    authority: "server-utc",
    preWavePrimingSeconds: 30,
    animation: "soft-expanding-ring"
  } as const;
}
