import type { CreatorCommerceTrust } from "./types";

export function evaluateCreatorCommerceTrust(input: Omit<CreatorCommerceTrust, "score">): CreatorCommerceTrust {
  const score =
    (input.verified ? 0.4 : 0) +
    (input.refundSafe ? 0.3 : 0) +
    (input.moderationSafe ? 0.3 : 0);

  return {
    ...input,
    score
  };
}

export function canActivateCreatorCommerce(trust: CreatorCommerceTrust): boolean {
  return trust.score >= 0.8 && trust.verified && trust.refundSafe && trust.moderationSafe;
}
