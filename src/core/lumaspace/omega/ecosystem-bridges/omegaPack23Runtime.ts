import { createEcosystemEvent } from "./eventEngine";
import { createEcosystemMemory } from "./memoryBridge";
import { createEcosystemSignal } from "./signalBridge";

export function runLumaSpaceOmegaMegaPack23Runtime() {
  const live = createEcosystemEvent({
    portal: "live",
    citizenId: "citizen-023",
    sourceId: "live-room-1",
    eventType: "room_completed",
  });
  const fyp = createEcosystemEvent({
    portal: "fyp",
    citizenId: "citizen-023",
    sourceId: "signal-1",
    eventType: "signal_seen",
  });

  const memory = createEcosystemMemory(live);
  const signal = createEcosystemSignal(fyp);

  return {
    ok:
      live.memoryEligible &&
      memory.destination === "community_tree" &&
      fyp.signalEligible &&
      signal.pulseEligible &&
      signal.contributionEligible,
    live,
    fyp,
    memory,
    signal,
  };
}
