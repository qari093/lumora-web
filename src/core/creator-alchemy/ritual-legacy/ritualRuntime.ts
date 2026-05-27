import type { RitualRuntimeDecision, RitualRuntimeInput } from "./types";

const MIN_DAYS: Record<RitualRuntimeInput["type"], number> = {
  one_time_mirror: 365,
  mirror_chamber: 365,
  lumora_letter: 365,
  voice_will: 0,
  legacy_trail: 30,
  memorial_garden: 0,
  fading_lamp: 0
};

export function decideRitualRuntime(input: RitualRuntimeInput): RitualRuntimeDecision {
  if (!input.creatorConsented) {
    return { allowed: false, type: input.type, reason: "creator_consent_required" };
  }

  if (input.emotionalOverload) {
    return { allowed: false, type: input.type, reason: "emotional_overload" };
  }

  if (input.daysSinceLastShown < MIN_DAYS[input.type]) {
    return { allowed: false, type: input.type, reason: "ritual_cooldown" };
  }

  return { allowed: true, type: input.type, reason: "ritual_allowed" };
}
