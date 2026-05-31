import type { EcosystemEvent, EcosystemMemory } from "./types";

export function createEcosystemMemory(event: EcosystemEvent): EcosystemMemory {
  if (!event.memoryEligible) throw new Error("event_not_memory_eligible");

  return {
    id: `eco_memory_${event.id}`,
    eventId: event.id,
    destination: event.portal === "live" ? "community_tree" : "space_vault",
  };
}
