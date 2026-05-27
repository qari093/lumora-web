import { isZenEconomyUseAllowed, type ZenEconomyUse } from "./allowedUses";

export type ZenEconomyTransaction = {
  userId: string;
  use: ZenEconomyUse;
  amount: number;
  approved: boolean;
  reason: string;
};

export function validateZenEconomyTransaction(input: {
  userId: string;
  use: ZenEconomyUse;
  amount: number;
}): ZenEconomyTransaction {
  const allowed = isZenEconomyUseAllowed(input.use);
  const amountValid = Number.isFinite(input.amount) && input.amount > 0;

  return {
    userId: input.userId,
    use: input.use,
    amount: input.amount,
    approved: allowed && amountValid,
    reason: allowed && amountValid ? "approved_expression_only" : "blocked_by_ethics_policy",
  };
}
