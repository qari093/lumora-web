import { chooseAdTiming } from "./timing";
import { calculateSessionPacing } from "./pacing";
import { shouldPrefetchAd } from "./prefetch";
import { resolveAdDeliveryFallback } from "./fallback";

export function evaluateAdDelivery(input: {
  userState: "green" | "yellow" | "red";
  sessionDepth: number;
  completionJustHappened: boolean;
  videosWatched: number;
  adsShown: number;
  targetSpacing: number;
  networkQuality: "low" | "medium" | "high";
  adAvailable: boolean;
}) {
  const timing = chooseAdTiming(input);
  const pacing = calculateSessionPacing(input);
  const prefetch = shouldPrefetchAd({
    userState: input.userState,
    nextSlotEligible: pacing.canServe,
    networkQuality: input.networkQuality,
  });
  const fallback = resolveAdDeliveryFallback({
    adAvailable: input.adAvailable,
    userState: input.userState,
  });

  return {
    ok: true,
    timing,
    pacing,
    prefetch,
    fallback,
  };
}
