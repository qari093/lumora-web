export type CreatorResonanceInput = {
  healthyEngagement: number;
  retentionQuality: number;
  moderationTrust: number;
  rageSignals: number;
};

export function calculateCreatorResonance(input: CreatorResonanceInput): number {
  const positive = input.healthyEngagement * 0.4 + input.retentionQuality * 0.35 + input.moderationTrust * 0.25;
  const penalty = input.rageSignals * 0.6;
  return Math.max(0, Math.min(100, Math.round(positive - penalty)));
}
