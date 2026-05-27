export const cinematicUiSystems = [
  "film-grain",
  "ambient-particles",
  "deep-black-mode",
  "immersive-player",
  "motion-system",
] as const;

export function supportsReducedMotion(enabled: boolean) {
  return enabled;
}

export function cinematicTheme() {
  return {
    atmosphere: "cinematic",
    contrast: "deep-black",
  };
}
