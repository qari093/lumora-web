export type CelebrationKind = "birthday" | "memorial" | "festival" | "community" | "global" | "quiet";

export function resolvePulseSunHue(kind: CelebrationKind | string): string {
  if (kind === "birthday") return "gold";
  if (kind === "memorial") return "silver";
  if (kind === "festival") return "aurora";
  if (kind === "global") return "indigo";
  return "lavender";
}

export function createPulseSunMutation(kind: CelebrationKind | string = "quiet") {
  return {
    active: true,
    anchor: "Pulse Sun",
    hue: resolvePulseSunHue(kind),
    rhythm: "soft-breath",
    mode: "celebration-atmosphere"
  } as const;
}
