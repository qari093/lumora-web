export type LiveSafetyDecision = "allow" | "slow_mode" | "moderator_review";

export type LiveSafetyInput = {
  toxicity: number;
  spamVelocity: number;
  emotionalEscalation: number;
};

export function decideLiveSafety(input: LiveSafetyInput): LiveSafetyDecision {
  const score = input.toxicity * 0.45 + input.spamVelocity * 0.25 + input.emotionalEscalation * 0.3;

  if (score >= 70) return "moderator_review";
  if (score >= 40) return "slow_mode";
  return "allow";
}
