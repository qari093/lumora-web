export type LiveGuardianInput = {
  emotionalIntensity: number;
  speakerStress: number;
  conflictVelocity: number;
};

export type LiveGuardianPrompt = {
  shouldPrompt: boolean;
  message: string;
};

export function evaluateLiveGuardian(input: LiveGuardianInput): LiveGuardianPrompt {
  const score =
    input.emotionalIntensity * 0.45 +
    input.speakerStress * 0.35 +
    input.conflictVelocity * 0.2;

  if (score >= 75) {
    return {
      shouldPrompt: true,
      message: "The room’s emotional intensity is rising. A gentle pause may be welcome.",
    };
  }

  return { shouldPrompt: false, message: "" };
}
