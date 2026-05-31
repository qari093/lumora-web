import type { WisdomChallenge, WisdomTopic } from "./types";

export function createWisdomChallenge(input: {
  id: string;
  topic: WisdomTopic;
  prompt: string;
  minimumAppreciations?: number;
}): WisdomChallenge {
  if (!input.id.trim()) throw new Error("challenge_id_required");
  if (!input.prompt.trim()) throw new Error("challenge_prompt_required");

  return {
    id: input.id,
    topic: input.topic,
    prompt: input.prompt,
    active: true,
    minimumAppreciations: input.minimumAppreciations ?? 5,
    rewardCosmetic: "lamp_of_wisdom",
  };
}

export function completeWisdomChallenge(input: {
  challenge: WisdomChallenge;
  appreciationCount: number;
}): boolean {
  return input.challenge.active && input.appreciationCount >= input.challenge.minimumAppreciations;
}
