export type MonetizationVariant = "control" | "gentle" | "reward_heavy" | "low_frequency";

export function assignMonetizationVariant(input: {
  userId: string;
  salt?: string;
}): MonetizationVariant {
  const salt = input.salt || "lumora";
  const raw = `${input.userId}:${salt}`;
  const score = raw.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100;

  if (score < 25) return "control";
  if (score < 50) return "gentle";
  if (score < 75) return "reward_heavy";
  return "low_frequency";
}
