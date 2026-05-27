export function validateCreatorEarnings(input: {
  payout: number;
  zenEarned: number;
  eligible: boolean;
}) {
  return {
    ok:
      input.payout >= 0 &&
      input.zenEarned >= 0 &&
      typeof input.eligible === "boolean",
  };
}
