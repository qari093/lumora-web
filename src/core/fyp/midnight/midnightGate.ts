import type { AtmosphereMode } from "../core/types";

export type MidnightGate = {
  gateId: string;
  mode: AtmosphereMode;
  opensHour: number;
  closesHour: number;
  secretTrigger: string;
  active: boolean;
};

export function createMidnightGate(input: {
  gateId: string;
  mode: AtmosphereMode;
  opensHour?: number;
  closesHour?: number;
  secretTrigger: string;
}): MidnightGate {
  if (!input.gateId.trim() || !input.secretTrigger.trim()) {
    throw new Error("Midnight Gate requires gateId and secretTrigger.");
  }

  return {
    gateId: input.gateId,
    mode: input.mode,
    opensHour: input.opensHour ?? 0,
    closesHour: input.closesHour ?? 4,
    secretTrigger: input.secretTrigger,
    active: true
  };
}

export function canEnterMidnightGate(input: {
  gate: MidnightGate;
  localHour: number;
  trigger: string;
}): boolean {
  return (
    input.gate.active &&
    input.localHour >= input.gate.opensHour &&
    input.localHour <= input.gate.closesHour &&
    input.trigger === input.gate.secretTrigger
  );
}
