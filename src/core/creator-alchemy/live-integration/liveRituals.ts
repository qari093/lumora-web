import type { LiveAlchemyMode, LiveRitualDecision } from "./types";

export function decideLiveRitual(input: {
  ritual: LiveAlchemyMode;
  resonance: number;
  moderationSafe: boolean;
  daysSinceLastRitual: number;
}): LiveRitualDecision {
  if (!input.moderationSafe) {
    return { allowed: false, ritual: input.ritual, reason: "moderation_not_safe" };
  }

  if (input.daysSinceLastRitual < 14 && input.ritual !== "constellation_room") {
    return { allowed: false, ritual: input.ritual, reason: "ritual_cooldown" };
  }

  if (input.ritual === "dream_chamber" && input.resonance < 0.72) {
    return { allowed: false, ritual: input.ritual, reason: "dream_resonance_low" };
  }

  return { allowed: true, ritual: input.ritual, reason: "live_ritual_allowed" };
}
