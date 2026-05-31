import type { PulseSignal } from "./types";
import { createPulseSignal } from "./signalEngine";

export function injectWisdomSignal(signals: PulseSignal[], citizenId: string): PulseSignal[] {
  return [
    ...signals,
    createPulseSignal({
      id: `wisdom_${citizenId}`,
      kind: "wisdom_beacon",
      creatorId: "guardian-wisdom",
      title: "A quiet lesson from a Guardian",
      emotionalWeight: 82,
      trustScore: 95,
      freshness: 70,
      diversityKey: "wisdom",
    }),
  ];
}

export function injectMissionSignal(signals: PulseSignal[], communityId: string): PulseSignal[] {
  return [
    ...signals,
    createPulseSignal({
      id: `mission_${communityId}`,
      kind: "mission_recap",
      creatorId: communityId,
      communityId,
      title: "Your Crystal Mission is glowing",
      emotionalWeight: 88,
      trustScore: 90,
      freshness: 80,
      diversityKey: "mission",
    }),
  ];
}

export function injectBridgeSignal(signals: PulseSignal[], citizenId: string): PulseSignal[] {
  return [
    ...signals,
    createPulseSignal({
      id: `bridge_${citizenId}`,
      kind: "bridge_invitation",
      creatorId: "serendipity-gate",
      title: "Someone out there shares your light",
      emotionalWeight: 91,
      trustScore: 88,
      freshness: 92,
      diversityKey: "bridge",
    }),
  ];
}
