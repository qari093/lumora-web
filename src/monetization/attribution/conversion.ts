export type AdConversion = {
  conversionId: string;
  impressionId: string;
  campaignId: string;
  value: number;
  occurredAt: number;
};

export function createAdConversion(input: AdConversion) {
  return {
    ...input,
    valid: input.value >= 0 && input.occurredAt > 0,
  };
}
