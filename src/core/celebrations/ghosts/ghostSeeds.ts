export function createGhostSeed() {
  return {
    fading: true,
    storage: "tiny-seed",
    regeneratedProcedurally: true,
    personalArtifactsStored: false
  } as const;
}
