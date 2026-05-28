export type ZenAction = "gift" | "anchor" | "support" | "unlock";
export type ZenLedgerEntry = {
  id: string;
  action: ZenAction;
  amount: number;
  reason: string;
  safe: boolean;
  createdAt: string;
};

export function createZenLedgerEntry(input: {
  action: ZenAction;
  amount: number;
  reason: string;
}): ZenLedgerEntry {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("zen_amount_must_be_positive");
  }

  return {
    id: `zen_${input.action}_${Math.round(input.amount * 100)}_${input.reason.length}`,
    action: input.action,
    amount: Math.round(input.amount * 100) / 100,
    reason: input.reason.trim() || "emotional_support",
    safe: true,
    createdAt: new Date(0).toISOString()
  };
}

export function canSpendZen(balance: number, amount: number): boolean {
  return Number.isFinite(balance) && Number.isFinite(amount) && balance >= amount && amount > 0;
}
