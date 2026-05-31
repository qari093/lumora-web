import type { MentorRecognition } from "./types";

export function createMentorRecognition(input: {
  guardianId: string;
  helpedCount: number;
}): MentorRecognition {
  const helpedCount = Math.max(0, input.helpedCount);

  return {
    guardianId: input.guardianId,
    helpedCount,
    legacyBloomUnlocked: helpedCount >= 10,
    recognitionMotif:
      helpedCount >= 25 ? "guardian_constellation" :
      helpedCount >= 10 ? "steady_lantern" :
      "small_lamp",
  };
}
