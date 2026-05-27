export interface CalmDividend {
  earned: number;
  rebate: number;
}

export function calculateCalmDividend(
  amount: number
): CalmDividend {
  const fee = amount * 0.02;

  return {
    earned: Number((fee * 0.3).toFixed(2)),
    rebate: Number(fee.toFixed(2))
  };
}
