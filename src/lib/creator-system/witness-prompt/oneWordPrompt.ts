export type WitnessPromptWord =
  | "still"
  | "warm"
  | "curious"
  | "heavy"
  | "amused";

export const WITNESS_PROMPT_WORDS: WitnessPromptWord[] = [
  "still",
  "warm",
  "curious",
  "heavy",
  "amused",
];

export function isWitnessPromptWord(value: string): value is WitnessPromptWord {
  return WITNESS_PROMPT_WORDS.includes(value as WitnessPromptWord);
}
