export const FYP_CARD_TYPES = [
  "teaser",
  "metadata",
  "trend",
  "fallback",
  "cta",
] as const;

export type FypCardType = typeof FYP_CARD_TYPES[number];

export function assertValidCardType(type: string): asserts type is FypCardType {
  if (!FYP_CARD_TYPES.includes(type as FypCardType)) {
    throw new Error(`Invalid FYP card type: ${type}`);
  }
}
