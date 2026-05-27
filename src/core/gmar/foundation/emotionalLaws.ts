export const emotionalLaws = [
  "memory_over_grind",
  "presence_over_pressure",
  "warmth_over_virality",
  "meaning_over_extraction",
  "calm_and_adrenaline_balance",
] as const;

export function emotionalLawCount(): number {
  return emotionalLaws.length;
}
