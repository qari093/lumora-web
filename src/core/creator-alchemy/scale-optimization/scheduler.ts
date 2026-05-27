export interface RitualScheduleDecision {
  allowed: boolean;
  delayMinutes: number;
  reason: string;
}

export function scheduleDreamChamberUnderLoad(input: {
  resonance: number;
  currentLoad: number;
  queueDepth: number;
}): RitualScheduleDecision {
  if (input.resonance < 0.72) return { allowed: false, delayMinutes: 0, reason: "resonance_low" };
  if (input.currentLoad > 0.85 || input.queueDepth > 200) {
    return { allowed: true, delayMinutes: 30, reason: "delayed_for_load" };
  }

  return { allowed: true, delayMinutes: 0, reason: "scheduled_now" };
}
