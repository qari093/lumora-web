import type { PulseCycle, PulseReflection, PulseSignal } from "./types";
import { rankPulseSignals, applySignalDiversity } from "./rankingEngine";

export function createPulseCycle(input: {
  citizenId: string;
  signals: PulseSignal[];
  maxSignals?: number;
}): PulseCycle {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  const maxSignals = input.maxSignals ?? 12;
  const ranked = applySignalDiversity(rankPulseSignals(input.signals)).slice(0, maxSignals);

  return {
    citizenId: input.citizenId,
    signals: ranked,
    maxSignals,
    completed: false,
  };
}

export function completePulseCycle(cycle: PulseCycle): PulseCycle {
  return {
    ...cycle,
    completed: true,
    reflectionPrompt: "You have seen what your world created. What will you add?",
  };
}

export function createPulseReflection(cycle: PulseCycle): PulseReflection {
  return {
    citizenId: cycle.citizenId,
    viewedSignals: cycle.signals.length,
    prompt: cycle.reflectionPrompt ?? "Your universe is waiting.",
    suggestedActions: ["create_memory", "send_light", "open_vault", "join_mission"],
  };
}
