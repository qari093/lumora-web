export type CtrInput = {
  impressions: number;
  clicks: number;
};

export type CtrResult = {
  impressions: number;
  clicks: number;
  ctr: number;
};

export function calculateCtr(input: CtrInput): CtrResult {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));

  if (impressions === 0) {
    return {
      impressions,
      clicks,
      ctr: 0,
    };
  }

  return {
    impressions,
    clicks,
    ctr: Number((clicks / impressions).toFixed(4)),
  };
}
