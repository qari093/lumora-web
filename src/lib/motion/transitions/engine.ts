export type CinematicTransition = {
  name: string;
  durationMs: number;
  easing: string;
  usesBlur: boolean;
};

export function buildCinematicTransitions(): CinematicTransition[] {
  return [
    { name: "prism_fade", durationMs: 420, easing: "ease-out", usesBlur: true },
    { name: "signal_push", durationMs: 360, easing: "cubic-bezier(0.2,0.8,0.2,1)", usesBlur: false },
    { name: "hero_bloom", durationMs: 520, easing: "ease-in-out", usesBlur: true }
  ];
}
