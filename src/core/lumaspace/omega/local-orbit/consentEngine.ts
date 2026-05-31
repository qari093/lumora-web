import type { LocalOrbitConsent } from "./types";

export function createLocalOrbitConsent(input: {
  citizenId: string;
  visibility: LocalOrbitConsent["visibility"];
  bridgeMatching: boolean;
  ttlHours?: number;
}): LocalOrbitConsent {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId: input.citizenId,
    visibility: input.visibility,
    bridgeMatching: input.bridgeMatching,
    expiresAt: Date.now() + (input.ttlHours ?? 24) * 60 * 60 * 1000,
  };
}

export function canUseLocalOrbit(consent: LocalOrbitConsent, now = Date.now()): boolean {
  return consent.visibility !== "off" && consent.bridgeMatching && consent.expiresAt > now;
}
