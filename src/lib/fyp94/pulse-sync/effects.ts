import type { Fyp94PulseSyncEffect, Fyp94PulseSyncTrigger } from "./types";
import { isFyp94PulseSyncEligible } from "./triggers";

export function buildFyp94PulseSyncEffect(trigger: Fyp94PulseSyncTrigger): Fyp94PulseSyncEffect {
  if (!isFyp94PulseSyncEligible(trigger)) {
    return {
      clipId: trigger.clipId,
      visualPulse: false,
      haptic: false,
      peakMs: trigger.peakMs,
      intensity: "none",
    };
  }

  const strong = trigger.thrillScore >= 95 && trigger.viewerCount >= 1000;

  return {
    clipId: trigger.clipId,
    visualPulse: true,
    haptic: true,
    peakMs: trigger.peakMs,
    intensity: strong ? "strong" : "subtle",
  };
}
