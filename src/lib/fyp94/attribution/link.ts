import type { Fyp94AttributionLink } from "./types";

export function createFyp94AttributionLink(input: {
  anonymousUserId: string;
  category: string;
  waveId: string;
  signalWeight: number;
  now?: Date;
}): Fyp94AttributionLink {
  const level =
    input.signalWeight >= 10 ? "high" : input.signalWeight >= 3 ? "medium" : "low";

  return {
    anonymousUserId: input.anonymousUserId,
    category: input.category,
    waveId: input.waveId,
    contributionLevel: level,
    createdAt: (input.now ?? new Date()).toISOString(),
  };
}
