import type { LumoraSignal } from "@/types/lumora.signal";

export type TrailerPriorityAnnotatedSignal = LumoraSignal & {
  isTrailerEvent: boolean;
  trailerPriorityScore: number;
  trailerPriorityBand: "none" | "watch" | "boost" | "override";
  trailerPriorityReason: string;
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function isTrailerLike(signal: LumoraSignal): boolean {
  const blob = [
    signal.title,
    signal.summary,
    ...(signal.keywords || []),
    ...(signal.hashtags || []),
  ]
    .join(" ")
    .toLowerCase();

  return [
    "trailer",
    "teaser",
    "official trailer",
    "official teaser",
    "clip drop",
    "first look",
    "cineverse",
  ].some((term) => blob.includes(term));
}

function deriveBand(score: number): "none" | "watch" | "boost" | "override" {
  if (score >= 85) return "override";
  if (score >= 65) return "boost";
  if (score >= 40) return "watch";
  return "none";
}

export function deriveTrailerPriority(signal: LumoraSignal): {
  isTrailerEvent: boolean;
  score: number;
  band: "none" | "watch" | "boost" | "override";
  reason: string;
} {
  const trailerLike = isTrailerLike(signal);
  if (!trailerLike) {
    return {
      isTrailerEvent: false,
      score: 0,
      band: "none",
      reason: "not_trailer_like",
    };
  }

  const velocity = signal.velocityScore || 0;
  const attention = signal.attentionScore || 0;
  const saturation = signal.saturationScore || 0;
  const freshnessHours = Math.max(
    0,
    (Date.now() - (signal.updatedAt || signal.createdAt || Date.now())) / (1000 * 60 * 60)
  );
  const freshnessBoost = Math.max(0, 25 - freshnessHours * 1.2);

  const score = clamp(
    velocity * 0.35 +
    attention * 0.35 +
    freshnessBoost +
    (signal.platform === "news_rss" || signal.platform === "google_trends" ? 8 : 0) -
    saturation * 0.15
  );

  return {
    isTrailerEvent: true,
    score: Number(score.toFixed(2)),
    band: deriveBand(score),
    reason: "trailer_keywords + velocity + attention + freshness - saturation",
  };
}

export function annotateTrailerPriority(signal: LumoraSignal): TrailerPriorityAnnotatedSignal {
  const derived = deriveTrailerPriority(signal);
  return {
    ...signal,
    isTrailerEvent: derived.isTrailerEvent,
    trailerPriorityScore: derived.score,
    trailerPriorityBand: derived.band,
    trailerPriorityReason: derived.reason,
  };
}

export function annotateTrailerPriorityBatch(
  signals: LumoraSignal[]
): TrailerPriorityAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : [])
    .map(annotateTrailerPriority)
    .sort((a, b) => b.trailerPriorityScore - a.trailerPriorityScore);
}
