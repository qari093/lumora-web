export type ConversionRateInput = {
  clicks: number;
  conversions: number;
};

export type ConversionRateResult = {
  clicks: number;
  conversions: number;
  conversionRate: number;
};

export function calculateConversionRate(
  input: ConversionRateInput
): ConversionRateResult {
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));
  const conversions = Math.max(0, Math.floor(input.conversions ?? 0));

  if (clicks === 0) {
    return {
      clicks,
      conversions,
      conversionRate: 0,
    };
  }

  return {
    clicks,
    conversions,
    conversionRate: Number((conversions / clicks).toFixed(4)),
  };
}
