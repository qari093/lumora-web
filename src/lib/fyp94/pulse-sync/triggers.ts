import type { Fyp94PulseSyncTrigger } from "./types";

export function isFyp94PulseSyncEligible(trigger: Fyp94PulseSyncTrigger): boolean {
  if (!trigger.userEnabled) return false;
  if (trigger.peakMs < 0) return false;

  const highThrill = trigger.thrillScore >= 85;
  const highCrowd = trigger.viewerCount >= 500;
  const waveActive = Boolean(trigger.waveId);

  return highThrill && (highCrowd || waveActive);
}
