import type { SafetySignal, TrustProfile } from "./types";

export function createTrustProfile(input: {
  citizenId: string;
  trustScore?: number;
  reliabilityScore?: number;
}): TrustProfile {
  const trustScore = Math.max(0, Math.min(100, input.trustScore ?? 80));
  const reliabilityScore = Math.max(0, Math.min(100, input.reliabilityScore ?? 80));

  return {
    citizenId: input.citizenId,
    trustScore,
    reliabilityScore,
    limited: trustScore < 40 || reliabilityScore < 40,
  };
}

export function applySafetySignalToTrust(profile: TrustProfile, signal: SafetySignal): TrustProfile {
  const penalty = signal.severity === "high" ? 30 : signal.severity === "medium" ? 12 : 2;
  return createTrustProfile({
    citizenId: profile.citizenId,
    trustScore: profile.trustScore - penalty,
    reliabilityScore: profile.reliabilityScore - Math.floor(penalty / 2),
  });
}
