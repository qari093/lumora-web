import type { EcosystemEvent, LumoraPortal } from "./types";

export function createEcosystemEvent(input: {
  portal: LumoraPortal;
  citizenId: string;
  sourceId: string;
  eventType: string;
}): EcosystemEvent {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (!input.sourceId.trim()) throw new Error("sourceId_required");

  return {
    id: `eco_${input.portal}_${input.sourceId}`,
    portal: input.portal,
    citizenId: input.citizenId,
    sourceId: input.sourceId,
    eventType: input.eventType,
    memoryEligible: ["live", "gmar", "cineverse", "nexa", "echo"].includes(input.portal),
    signalEligible: ["fyp", "live", "cineverse", "echo"].includes(input.portal),
  };
}
