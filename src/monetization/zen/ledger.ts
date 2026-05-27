export type ZenLedgerEntry = {
  id: string;
  userId: string;
  amount: number;
  direction: "credit" | "debit";
  reason: string;
  createdAt: string;
};

export function createZenLedgerEntry(input: {
  userId: string;
  amount: number;
  direction: "credit" | "debit";
  reason: string;
  createdAt?: string;
}): ZenLedgerEntry {
  if (!input.userId) throw new Error("user_id_required");
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("positive_amount_required");

  return {
    id: `zen_${input.userId}_${Date.now()}`,
    userId: input.userId,
    amount: input.amount,
    direction: input.direction,
    reason: input.reason,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

export function calculateZenBalance(entries: ZenLedgerEntry[]) {
  return entries.reduce((balance, entry) => {
    return entry.direction === "credit"
      ? balance + entry.amount
      : balance - entry.amount;
  }, 0);
}
