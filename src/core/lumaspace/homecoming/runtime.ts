export type LumaSpaceMood =
  | "wonder"
  | "calm"
  | "dream"
  | "focus"
  | "healing"
  | "shadow";

export type HomecomingPhase =
  | "dark"
  | "star"
  | "whisper"
  | "universe";

export const HOMECOMING_SEQUENCE_MS = {
  star: 800,
  whisper: 1800,
  universe: 3400,
  softComplete: 4200
} as const;

export const moodAtmosphere: Record<LumaSpaceMood, string> = {
  wonder:
    "radial-gradient(circle at 50% 22%, rgba(34,211,238,.28), transparent 34%), radial-gradient(circle at 25% 72%, rgba(168,85,247,.22), transparent 42%), #02030a",

  calm:
    "radial-gradient(circle at 50% 22%, rgba(147,197,253,.24), transparent 34%), radial-gradient(circle at 72% 78%, rgba(103,232,249,.14), transparent 42%), #03111f",

  dream:
    "radial-gradient(circle at 50% 20%, rgba(251,191,36,.18), transparent 32%), radial-gradient(circle at 28% 75%, rgba(192,132,252,.22), transparent 42%), #09051a",

  focus:
    "radial-gradient(circle at 50% 24%, rgba(52,211,153,.22), transparent 34%), radial-gradient(circle at 78% 74%, rgba(34,211,238,.12), transparent 42%), #03140f",

  healing:
    "radial-gradient(circle at 50% 25%, rgba(244,114,182,.18), transparent 34%), radial-gradient(circle at 25% 75%, rgba(134,239,172,.16), transparent 42%), #100815",

  shadow:
    "radial-gradient(circle at 50% 25%, rgba(129,140,248,.18), transparent 34%), radial-gradient(circle at 70% 80%, rgba(15,23,42,.86), transparent 42%), #02030a"
};

export function getHomecomingPhase(
  elapsedMs: number
): HomecomingPhase {
  if (elapsedMs < HOMECOMING_SEQUENCE_MS.star) {
    return "dark";
  }

  if (elapsedMs < HOMECOMING_SEQUENCE_MS.whisper) {
    return "star";
  }

  if (elapsedMs < HOMECOMING_SEQUENCE_MS.universe) {
    return "whisper";
  }

  return "universe";
}
