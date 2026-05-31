import type { BridgeGate, ConstellationBridge, StarlightPulse } from "./types";
import { pulsesAreReciprocal } from "./starlightPulse";

export function formConstellationBridge(input: {
  pulseA: StarlightPulse;
  pulseB: StarlightPulse;
}): ConstellationBridge {
  if (!pulsesAreReciprocal(input.pulseA, input.pulseB)) {
    throw new Error("reciprocal_pulses_required");
  }

  const citizenA = input.pulseA.fromCitizenId;
  const citizenB = input.pulseA.toCitizenId;
  const gate: BridgeGate = input.pulseA.gate;

  return {
    id: `bridge_${citizenA}_${citizenB}_${gate}`,
    citizenA,
    citizenB,
    gate,
    status: "active",
    threadSpaceId: `thread_${citizenA}_${citizenB}_${gate}`,
    formedAt: Date.now(),
    trustStage: "spark",
  };
}

export function advanceBridgeTrust(bridge: ConstellationBridge): ConstellationBridge {
  const next = {
    spark: "companion",
    companion: "builder",
    builder: "guardian",
    guardian: "legacy",
    legacy: "legacy",
  } as const;

  return {
    ...bridge,
    trustStage: next[bridge.trustStage],
    status: bridge.trustStage === "guardian" || bridge.trustStage === "legacy" ? "trusted" : bridge.status,
  };
}
