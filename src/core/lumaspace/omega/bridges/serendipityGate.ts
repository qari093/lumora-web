import type { BridgeCandidate, BridgeGate, SoulThreadProfile } from "./types";
import { calculateAffinity, rankBridgeCandidates } from "./affinityEngine";

export function openSerendipityGate(input: {
  viewer: SoulThreadProfile;
  candidates: SoulThreadProfile[];
  gate: BridgeGate;
}): BridgeCandidate | null {
  const ranked = rankBridgeCandidates(
    input.candidates
      .filter((candidate) => candidate.citizenId !== input.viewer.citizenId)
      .map((candidate) => calculateAffinity(input.viewer, candidate, input.gate)),
  );

  return ranked[0] ?? null;
}

export function getDailyBridgeGatePrompt(gate: BridgeGate): string {
  if (gate === "purpose") return "Someone can build beside you today.";
  if (gate === "wisdom") return "A Guardian light may guide your next step.";
  return "Someone out there shares your light.";
}
