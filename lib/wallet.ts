export type LedgerEntry = any;
export const ledgerEntry: LedgerEntry = {} as any;

export const getWallet = async (..._args: any[]) => ({ id: "demo-wallet", balanceCents: 0 });
export const addLedgerEntry = async (..._args: any[]) => ({});
export const ensureWallet = async (..._args: any[]) => ({ id: "demo-wallet", balanceCents: 0 });
export const transferEuros = async (..._args: any[]) => ({ transfer: {} as any });
export const getLedgerCount = async (..._args: any[]) => 0;
