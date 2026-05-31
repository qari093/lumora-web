import type { PurposeMatch, PurposeMission } from "./types";

export function createPurposeMission(input: {
  match: PurposeMatch;
  title?: string;
  durationDays?: number;
}): PurposeMission {
  if (input.match.matchScore <= 0) throw new Error("match_score_too_low");

  return {
    id: `purpose_mission_${input.match.id}`,
    matchId: input.match.id,
    title: input.title ?? `Build together: ${input.match.mode.replaceAll("_", " ")}`,
    durationDays: input.durationDays ?? 7,
    progress: 0,
  };
}

export function advancePurposeMission(mission: PurposeMission, amount: number): PurposeMission {
  return {
    ...mission,
    progress: Math.max(0, Math.min(100, mission.progress + amount)),
    sharedMemoryId: mission.progress + amount >= 100
      ? mission.sharedMemoryId ?? `shared_memory_${mission.id}`
      : mission.sharedMemoryId,
  };
}
