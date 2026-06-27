export const FYP_EMOTIONAL_LANES = [
  "wonder",
  "learn",
  "laugh",
  "build",
  "reflect",
  "connect"
] as const;

export type FypEmotionalLane =
  typeof FYP_EMOTIONAL_LANES[number];
