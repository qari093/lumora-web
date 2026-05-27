const BLOCKED = [
  "good",
  "bad",
  "better",
  "worst",
  "cringe",
  "boring",
  "beautiful",
  "ugly",
  "talented",
  "failed",
];

export function containsJudgmentLanguage(text: string): boolean {
  const v = text.toLowerCase();
  return BLOCKED.some((word) => new RegExp(`\\b${word}\\b`).test(v));
}

export function cleanWitnessPromptLanguage(text: string) {
  return {
    ok: !containsJudgmentLanguage(text),
    reason: containsJudgmentLanguage(text) ? "judgment_language_rejected" : "clean_prompt_language",
  };
}
