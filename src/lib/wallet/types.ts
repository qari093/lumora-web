export type Money = { currency: "EUR"; amount: number }; // amount in euros as float for dev (DB would use cents)
export type LedgerEntry = {
  id: string;
  ownerId: string;
  kind: "credit" | "debit";
  euros: number;
  reason: string;
  at: number;
  requestId?: string | null;
};
export type Wallet = {
  ownerId: string;
  euros: number; // running balance in euros (dev)
  updatedAt: number;
};
