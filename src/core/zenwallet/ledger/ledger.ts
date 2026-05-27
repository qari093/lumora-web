export type LedgerEntry = {
  txId: string;
  previousHash: string | null;
  amount: number;
  balanceAfter: number;
  createdAt: string;
};

const ledger: LedgerEntry[] = [];

export function appendLedgerEntry(entry: LedgerEntry) {
  ledger.push(entry);
}

export function getLedger() {
  return ledger;
}
