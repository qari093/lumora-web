export const CELEBRATION_CONSTITUTION = {
  name: "Celebrations Ω∞",
  doctrine: "Celebrations are temporary emotional atmospheres, not extractive events.",
  principles: ["drift_never_push", "presence_over_pressure", "privacy_first", "calm_before_scale"]
} as const;

export function getCelebrationConstitution() {
  return CELEBRATION_CONSTITUTION;
}
