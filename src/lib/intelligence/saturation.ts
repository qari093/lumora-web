import type { LumoraSignal } from "@/types/lumora.signal";

export type SaturationAnnotatedSignal = LumoraSignal & {
  derivedSaturationIndex: number;
  saturationBand: "low" | "medium" | "high";
  saturationReason: string;
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function deriveBand(index: number): "low" | "medium" | "high" {
  if (index >= 70) return "high";
  if (index >= 40) return "medium";
  return "low";
}

export function deriveSaturation(signal: LumoraSignal): {
  index: number;
  band: "low" | "medium" | "high";
  reason: string;
} {
  const explicitSaturation = signal.saturationScore || 0;
  const hashtagDensity = Math.min((signal.hashtags?.length || 0) * 4, 20);
  const keywordDensity = Math.min((signal.keywords?.length || 0) * 3, 18);

  const ageHours = Math.max(
    0,
    (Date.now() - (signal.updatedAt || signal.createdAt || Date.now())) / (1000 * 60 * 60)
  );
  const ageFactor = Math.min(ageHours * 1.5, 20);

  const velocityCounterbalance = Math.min((signal.velocityScore || 0) * 0.08, 10);

  const index = clamp(
    explicitSaturation * 0.65 +
    hashtagDensity +
    keywordDensity +
    ageFactor -
    velocityCounterbalance
  );

  return {
    index: Number(index.toFixed(2)),
    band: deriveBand(index),
    reason: "explicit_saturation + tag_density + keyword_density + age_factor - velocity_counterbalance",
  };
}

export function annotateSaturation(signal: LumoraSignal): SaturationAnnotatedSignal {
  const derived = deriveSaturation(signal);
  return {
    ...signal,
    derivedSaturationIndex: derived.index,
    saturationBand: derived.band,
    saturationReason: derived.reason,
  };
}

export function annotateSaturationBatch(signals: LumoraSignal[]): SaturationAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateSaturation);
}
