import type { CreatorConstellationState, DriftDecision, DriftReason } from "./types";

export function calculateAdaptiveDrift(state: CreatorConstellationState): DriftDecision {
  const reasons: DriftReason[] = [];

  if (state.toneShift >= 0.4) reasons.push("tone_shift");
  if (state.audienceMutation >= 0.5) reasons.push("audience_mutation");
  if (state.creatorCuriosity >= 0.35) reasons.push("creator_curiosity");

  const driftStrength = clamp01(
    state.toneShift * 0.38 + state.audienceMutation * 0.37 + state.creatorCuriosity * 0.25
  );

  const shouldDrift = reasons.length >= 2 || driftStrength >= 0.52;
  const suggestedExposure = shouldDrift ? Math.min(0.3, 0.08 + driftStrength * 0.35) : 0.05;

  return {
    shouldDrift,
    reasons,
    driftStrength,
    suggestedExposure
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
