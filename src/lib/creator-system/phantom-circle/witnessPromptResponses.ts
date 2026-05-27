export type WitnessPromptResponse =
  | "still"
  | "warm"
  | "curious"
  | "heavy"
  | "amused";

export function isValidWitnessPromptResponse(value: string): value is WitnessPromptResponse {
  return ["still", "warm", "curious", "heavy", "amused"].includes(value);
}

export function recordWitnessPromptResponse(input: {
  circleId: string;
  userId: string;
  response: WitnessPromptResponse;
  createdAt?: string;
}) {
  return {
    ...input,
    createdAt: input.createdAt || new Date().toISOString(),
    judgmentLanguage: false,
  };
}
