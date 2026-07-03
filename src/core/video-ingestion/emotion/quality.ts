import type { EmotionalFingerprint } from "./types";

export type EmotionalQualityGate = {
  passed: boolean;
  approvedLane: EmotionalFingerprint["dominantLane"];
  reasons: string[];
};

export function evaluateEmotionalQuality(
  fingerprint: EmotionalFingerprint,
): EmotionalQualityGate {
  const reasons: string[] = [];

  if (fingerprint.serenity < 0.60)
    reasons.push("serenity_below_threshold");

  if (fingerprint.spectacle > 0.70)
    reasons.push("spectacle_above_limit");

  if (
    fingerprint.motionIntensity > 0.75 &&
    fingerprint.safeForCalmMode
  ) {
    reasons.push("calm_mode_contract_violation");
  }

  if (
    fingerprint.audioEnergy > 0.90 &&
    fingerprint.silenceRatio < 0.10
  ) {
    reasons.push("aggressive_audio_profile");
  }

  return {
    passed: reasons.length === 0,
    approvedLane: fingerprint.dominantLane,
    reasons,
  };
}

export function summarizeEmotionalReadiness(
  fingerprints: EmotionalFingerprint[],
) {
  const passed = fingerprints.filter(
    (item) => evaluateEmotionalQuality(item).passed,
  ).length;

  return {
    total: fingerprints.length,
    passed,
    readiness:
      fingerprints.length === 0
        ? 0
        : Number((passed / fingerprints.length).toFixed(4)),
  };
}
