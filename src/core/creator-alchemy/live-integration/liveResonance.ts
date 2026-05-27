import type { LiveResonanceSignal } from "./types";

export function calculateLiveResonance(signal: LiveResonanceSignal): number {
  const silentWeight = Math.min(1, signal.silentViewers / 100) * 0.3;
  const giftWeight = Math.min(1, signal.quietGifts / 30) * 0.25;
  const lingerWeight = Math.min(1, signal.lingerSecondsAvg / 120) * 0.25;
  const safetyWeight = Math.max(0, Math.min(1, signal.emotionalSafetyScore)) * 0.2;

  return silentWeight + giftWeight + lingerWeight + safetyWeight;
}
