import { isWitnessPromptWord, type WitnessPromptWord } from "./oneWordPrompt";

export type WitnessPromptResponse = {
  circleId: string;
  witnessId: string;
  videoId: string;
  word: WitnessPromptWord;
  createdAt: string;
};

export function createWitnessPromptResponse(input: {
  circleId: string;
  witnessId: string;
  videoId: string;
  word: string;
  createdAt?: string;
}): WitnessPromptResponse {
  if (!isWitnessPromptWord(input.word)) {
    throw new Error("Invalid witness prompt word");
  }

  return {
    circleId: input.circleId,
    witnessId: input.witnessId,
    videoId: input.videoId,
    word: input.word,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
