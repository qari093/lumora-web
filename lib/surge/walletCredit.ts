export type WalletCredit = {
  id: string;
  userId: string;
  amount: number;
  currency: "ZC";
  source: string;
  createdAt: number;
};

export function createWalletCredit(input: {
  userId: string;
  amount: number;
  source: string;
}): WalletCredit {
  return {
    id: `credit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    userId: input.userId,
    amount: Math.max(0, Math.floor(input.amount || 0)),
    currency: "ZC",
    source: input.source,
    createdAt: Date.now(),
  };
}
