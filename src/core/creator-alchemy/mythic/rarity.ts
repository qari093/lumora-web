import type { MythicEventType } from "./types";

const MIN_DAYS_BETWEEN: Record<MythicEventType, number> = {
  one_time_mirror: 365,
  mirror_chamber: 365,
  first_light: 90,
  one_night_sky: 180,
  annual_symbol_constellation: 365
};

export function canShowMythicEvent(input: {
  type: MythicEventType;
  daysSinceLastShown: number;
  emotionalOverloadLevel: "safe" | "watch" | "reduce" | "pause";
}): boolean {
  if (input.emotionalOverloadLevel === "pause" || input.emotionalOverloadLevel === "reduce") return false;
  return input.daysSinceLastShown >= MIN_DAYS_BETWEEN[input.type];
}

export function getMythicCooldownDays(type: MythicEventType): number {
  return MIN_DAYS_BETWEEN[type];
}
