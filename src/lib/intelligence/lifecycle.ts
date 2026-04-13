import type { LumoraSignal } from "@/types/lumora.signal";

export type LifecycleAnnotatedSignal = LumoraSignal & {
  derivedLifecycle: "rising" | "peaking" | "decaying" | "archived";
  lifecycleReason: string;
};

function deriveLifecycle(signal: LumoraSignal): {
  lifecycle: "rising" | "peaking" | "decaying" | "archived";
  reason: string;
} {
  const velocity = signal.velocityScore || 0;
  const attention = signal.attentionScore || 0;
  const saturation = signal.saturationScore || 0;
  const updatedAt = signal.updatedAt || signal.createdAt || Date.now();
  const ageHours = (Date.now() - updatedAt) / (1000 * 60 * 60);

  if (ageHours > 72) {
    return { lifecycle: "archived", reason: "age_gt_72h" };
  }

  if (velocity >= 80 && attention >= 75 && saturation < 40) {
    return { lifecycle: "rising", reason: "high_velocity_high_attention_low_saturation" };
  }

  if (velocity >= 65 && attention >= 65 && saturation >= 40 && saturation <= 70) {
    return { lifecycle: "peaking", reason: "strong_signal_with_mid_saturation" };
  }

  if (saturation > 70 || ageHours > 24) {
    return { lifecycle: "decaying", reason: "high_saturation_or_age_gt_24h" };
  }

  return { lifecycle: "rising", reason: "default_rising" };
}

export function annotateLifecycle(signal: LumoraSignal): LifecycleAnnotatedSignal {
  const derived = deriveLifecycle(signal);
  return {
    ...signal,
    derivedLifecycle: derived.lifecycle,
    lifecycleReason: derived.reason,
  };
}

export function annotateLifecycleBatch(signals: LumoraSignal[]): LifecycleAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateLifecycle);
}
