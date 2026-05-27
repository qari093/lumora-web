export function rankingValidator(score: number) {
  return { valid: score >= 0 && score <= 100 };
}
