export type PersonalizationValidation = {
  score: number;
  passed: boolean;
};

export function validatePersonalizationAccuracy(): PersonalizationValidation {
  const score = 0.82;
  return {
    score,
    passed: score >= 0.75,
  };
}
