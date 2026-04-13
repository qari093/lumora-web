import type { LumoraSignal } from "@/types/lumora.signal";
import { DEFAULT_FALLBACK_SIGNALS } from "@/lib/signals/fallback/defaultSignals";

export function getFallbackSignals(limit = 10): LumoraSignal[] {
  const safeLimit = Math.max(1, Math.min(50, limit));
  return DEFAULT_FALLBACK_SIGNALS
    .slice(0, safeLimit)
    .map((signal, index) => ({
      ...signal,
      id: `${signal.id}_${index + 1}`,
    }));
}
