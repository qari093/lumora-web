export type LedgerEntry = {
  debit: number;
  credit: number;
};

export function createLedgerEntry(
  debit: number,
  credit: number
): LedgerEntry {
  return {
    debit,
    credit
  };
}
