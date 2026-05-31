import type { DeepMemoryLetter } from "./types";

export function createDeepMemoryLetter(input: {
  citizenId: string;
  sourceMemoryIds: string[];
  strongestMoment: string;
}): DeepMemoryLetter {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  return {
    id: `deep_memory_${input.citizenId}_${Date.now()}`,
    citizenId: input.citizenId,
    sourceMemoryIds: input.sourceMemoryIds,
    letter: `From your Space, with quiet pride: ${input.strongestMoment} still glows in your story.`,
    privateByDefault: true,
  };
}
