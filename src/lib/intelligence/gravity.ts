import type { LumoraSignal } from "@/types/lumora.signal";

export type GravityAnnotatedSignal = LumoraSignal & {
  gravityScore: number;
  gravityBand: "low" | "medium" | "high" | "dominant";
  gravityReason: string;
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function deriveBand(score: number): "low" | "medium" | "high" | "dominant" {
  if (score >= 85) return "dominant";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function deriveGravity(signal: LumoraSignal): {
  score: number;
  band: "low" | "medium" | "high" | "dominant";
  reason: string;
} {
  const velocity = signal.velocityScore || 0;
  const attention = signal.attentionScore || 0;
  const saturation = signal.saturationScore || 0;

  const updatedAt = signal.updatedAt || signal.createdAt || Date.now();
  const ageHours = Math.max(0, (Date.now() - updatedAt) / (1000 * 60 * 60));
  const freshnessBoost = Math.max(0, 20 - ageHours * 0.75);

  const platformBoost =
    signal.platform === "google_trends" ? 8 :
    signal.platform === "news_rss" ? 6 :
    signal.platform === "twitter_x" ? 4 :
    signal.platform === "reddit" ? 3 :
    0;

  const score = clamp(
    velocity * 0.38 +
    attention * 0.37 +
    freshnessBoost +
    platformBoost -
    saturation * 0.22
  );

  return {
    score: Number(score.toFixed(2)),
    band: deriveBand(score),
    reason: "velocity + attention + freshness + platform_boost - saturation",
  };
}

export function annotateGravity(signal: LumoraSignal): GravityAnnotatedSignal {
  const derived = deriveGravity(signal);
  return {
    ...signal,
    gravityScore: derived.score,
    gravityBand: derived.band,
    gravityReason: derived.reason,
  };
}

export function annotateGravityBatch(signals: LumoraSignal[]): GravityAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : [])
    .map(annotateGravity)
    .sort((a, b) => b.gravityScore - a.gravityScore);
}
