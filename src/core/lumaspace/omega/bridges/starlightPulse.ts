import type { BridgeGate, StarlightPulse } from "./types";

export function sendStarlightPulse(input: {
  fromCitizenId: string;
  toCitizenId: string;
  gate: BridgeGate;
  ttlDays?: number;
}): StarlightPulse {
  if (!input.fromCitizenId.trim()) throw new Error("fromCitizenId_required");
  if (!input.toCitizenId.trim()) throw new Error("toCitizenId_required");
  if (input.fromCitizenId === input.toCitizenId) throw new Error("cannot_pulse_self");

  return {
    id: `starlight_${input.fromCitizenId}_${input.toCitizenId}_${Date.now()}`,
    fromCitizenId: input.fromCitizenId,
    toCitizenId: input.toCitizenId,
    gate: input.gate,
    senderEchoVisible: true,
    expiresAt: Date.now() + (input.ttlDays ?? 7) * 24 * 60 * 60 * 1000,
  };
}

export function pulsesAreReciprocal(a: StarlightPulse, b: StarlightPulse, now = Date.now()): boolean {
  return (
    a.fromCitizenId === b.toCitizenId &&
    a.toCitizenId === b.fromCitizenId &&
    a.gate === b.gate &&
    a.expiresAt > now &&
    b.expiresAt > now
  );
}
