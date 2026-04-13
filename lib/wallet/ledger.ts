export type LedgerEntry = {
  id: string;
  userId: string;
  direction: "credit" | "debit";
  amount: number;
  currency: "ZC";
  reference: string;
  createdAt: number;
};

export type LedgerTransaction = {
  transactionId: string;
  entries: LedgerEntry[];
  totalCredits: number;
  totalDebits: number;
  balanced: boolean;
};

export function createLedgerTransaction(input: {
  userId: string;
  amount: number;
  reference: string;
}): LedgerTransaction {
  const amount = Math.max(0, Math.floor(input.amount || 0));
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const credit: LedgerEntry = {
    id: `le_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    direction: "credit",
    amount,
    currency: "ZC",
    reference: input.reference,
    createdAt: Date.now(),
  };

  const debit: LedgerEntry = {
    id: `le_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: "system_pool",
    direction: "debit",
    amount,
    currency: "ZC",
    reference: input.reference,
    createdAt: Date.now(),
  };

  return {
    transactionId,
    entries: [credit, debit],
    totalCredits: amount,
    totalDebits: amount,
    balanced: true,
  };
}
