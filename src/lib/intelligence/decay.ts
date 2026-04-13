import type { LumoraSignal } from "@/types/lumora.signal";

export type DecayAnnotatedSignal = LumoraSignal & {
  decayRiskScore: number;
  decayWindowHours: number;
  decayState: "stable" | "watch" | "decaying" | "expired";
  decayReason: string;
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function deriveDecay(signal: LumoraSignal): {
  decayRiskScore: number;
  decayWindowHours: number;
  decayState: "stable" | "watch" | "decaying" | "expired";
  decayReason: string;
} {
  const velocity = signal.velocityScore || 0;
  const attention = signal.attentionScore || 0;
  const saturation = signal.saturationScore || 0;
  const updatedAt = signal.updatedAt || signal.createdAt || Date.now();
  const ageHours = Math.max(0, (Date.now() - updatedAt) / (1000 * 60 * 60));

  const decayRiskScore = clamp(
    saturation * 0.55 +
    ageHours * 2.5 -
    velocity * 0.18 -
    attention * 0.12
  );

  const decayWindowHours = Math.max(
    1,
    Math.round(
      48 -
      ageHours -
      saturation * 0.22 +
      velocity * 0.08 +
      attention * 0.04
    )
  );

  let decayState: "stable" | "watch" | "decaying" | "expired" = "stable";
  if (ageHours >= 72 || decayWindowHours <= 1) {
    decayState = "expired";
  } else if (decayRiskScore >= 70) {
    decayState = "decaying";
  } else if (decayRiskScore >= 40) {
    decayState = "watch";
  }

  return {
    decayRiskScore: Number(decayRiskScore.toFixed(2)),
    decayWindowHours,
    decayState,
    decayReason: "saturation + age - velocity - attention",
  };
}

export function annotateDecay(signal: LumoraSignal): DecayAnnotatedSignal {
  const derived = deriveDecay(signal);
  return {
    ...signal,
    decayRiskScore: derived.decayRiskScore,
    decayWindowHours: derived.decayWindowHours,
    decayState: derived.decayState,
    decayReason: derived.decayReason,
  };
}

export function annotateDecayBatch(signals: LumoraSignal[]): DecayAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateDecay);
}
