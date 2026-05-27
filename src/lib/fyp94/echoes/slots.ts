import type { Fyp94EchoSlot } from "./types";

export function buildFyp94EchoSlots(input: {
  participatedWaveIds: string[];
  allWaveIds: string[];
}): Fyp94EchoSlot[] {
  return input.allWaveIds.map((waveId) => ({
    waveId,
    status: input.participatedWaveIds.includes(waveId) ? "collected" : "missed",
  }));
}
