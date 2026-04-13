export type AdFatigueInput = {
  impressions: number;
  uniqueAdsSeen: number;
  clicks: number;
};

export type AdFatigueResult = {
  impressions: number;
  uniqueAdsSeen: number;
  clicks: number;
  repetitionRatio: number;
  fatigueScore: number;
  fatigued: boolean;
};

export function calculateAdFatigue(
  input: AdFatigueInput
): AdFatigueResult {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const uniqueAdsSeen = Math.max(0, Math.floor(input.uniqueAdsSeen ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));

  const safeUnique = Math.max(1, uniqueAdsSeen);
  const repetitionRatio =
    impressions === 0 ? 0 : Number(((impressions - uniqueAdsSeen) / Math.max(1, impressions)).toFixed(4));

  const clickRelief = impressions === 0 ? 0 : Math.min(0.35, clicks / Math.max(1, impressions));
  const fatigueScore = Number(Math.max(0, Math.min(1, repetitionRatio - clickRelief)).toFixed(4));

  return {
    impressions,
    uniqueAdsSeen,
    clicks,
    repetitionRatio,
    fatigueScore,
    fatigued: fatigueScore >= 0.45,
  };
}
