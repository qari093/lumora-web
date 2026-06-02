export type GravityAssistedLearningInput = {
  attempts: number;
  successfulRecognitions: number;
  falsePositives: number;
  frustrationEvents: number;
  exposures: number;
};

export type GravityAssistedLearningResult = {
  integrated: boolean;
  learningEnabled: boolean;
  accuracy: number;
  falsePositiveRate: number;
  frustrationRate: number;
  discoverabilityRate: number;
  canTuneThresholds: boolean;
  canUnlockAssisted: boolean;
};

function ratio(n: number, d: number): number {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return 0;
  return Math.max(0, Math.min(1, n / d));
}

export function evaluateAssistedLearning(input: GravityAssistedLearningInput): GravityAssistedLearningResult {
  const accuracy = ratio(input.successfulRecognitions, input.attempts);
  const falsePositiveRate = ratio(input.falsePositives, input.attempts);
  const frustrationRate = ratio(input.frustrationEvents, input.exposures);
  const discoverabilityRate = ratio(input.attempts, input.exposures);

  const canTuneThresholds = input.exposures >= 50;
  const canUnlockAssisted =
    canTuneThresholds &&
    accuracy >= 0.95 &&
    falsePositiveRate <= 0.03 &&
    frustrationRate <= 0.08 &&
    discoverabilityRate >= 0.35;

  return {
    integrated: true,
    learningEnabled: false,
    accuracy,
    falsePositiveRate,
    frustrationRate,
    discoverabilityRate,
    canTuneThresholds,
    canUnlockAssisted,
  };
}
