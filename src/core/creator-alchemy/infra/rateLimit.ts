import type { RateLimitDecision, RateLimitInput } from "./types";

export function decideFeatureRateLimit(input: RateLimitInput): RateLimitDecision {
  const remaining = Math.max(0, input.windowLimit - input.eventsThisWindow);

  return {
    allowed: remaining > 0,
    remaining
  };
}

export function mythicThrottleAllowed(daysSinceLastShown: number, minimumDays: number): boolean {
  return daysSinceLastShown >= minimumDays;
}
