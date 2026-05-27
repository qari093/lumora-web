export function simulateMonthlyRevenue(input: {
  sessions: number;
  revenuePerSession: number;
  creatorShareRate: number;
}) {
  const gross = input.sessions * input.revenuePerSession;
  const creatorShare = gross * input.creatorShareRate;
  const platformNet = gross - creatorShare;

  return {
    gross: Number(gross.toFixed(2)),
    creatorShare: Number(creatorShare.toFixed(2)),
    platformNet: Number(platformNet.toFixed(2)),
  };
}
