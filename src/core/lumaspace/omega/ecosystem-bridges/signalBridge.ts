import type { EcosystemEvent, EcosystemSignal } from "./types";

export function createEcosystemSignal(event: EcosystemEvent): EcosystemSignal {
  return {
    id: `eco_signal_${event.id}`,
    eventId: event.id,
    pulseEligible: event.signalEligible,
    contributionEligible: event.portal !== "zendoro",
  };
}
