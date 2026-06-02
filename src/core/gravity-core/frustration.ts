export type FrustrationResult = {
  frustrated: boolean;
  score: number;
};

export function detectFrustration(attempts: number, hesitationMs: number): FrustrationResult {
  const score = attempts * 10 + Math.floor(hesitationMs / 100);
  return {
    frustrated: score >= 40,
    score,
  };
}
