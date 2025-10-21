import { LedgerEntry, Wallet } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __WALLET_STORE: Map<string, Wallet> | undefined;
  // eslint-disable-next-line no-var
  var __LEDGER_STORE: Map<string, LedgerEntry> | undefined;
}

const WALLETS: Map<string, Wallet> = (globalThis.__WALLET_STORE ||= new Map());
const LEDGER: Map<string, LedgerEntry> = (globalThis.__LEDGER_STORE ||= new Map());

function rid() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

export function getWallet(ownerId: string): Wallet {
  let w = WALLETS.get(ownerId);
  if (!w) {
    w = { ownerId, euros: 0, updatedAt: Date.now() };
    WALLETS.set(ownerId, w);
  }
  return w;
}

export function ledgerFor(ownerId: string): LedgerEntry[] {
  return Array.from(LEDGER.values()).filter(e => e.ownerId === ownerId).sort((a,b)=>a.at-b.at);
}

export function credit(ownerId: string, euros: number, reason: string, requestId?: string | null): { wallet: Wallet; entry: LedgerEntry } {
  if (!(euros > 0)) throw new Error("NON_POSITIVE_CREDIT");
  const w = getWallet(ownerId);
  w.euros = +(w.euros + euros).toFixed(2);
  w.updatedAt = Date.now();

  const entry: LedgerEntry = { id: rid(), ownerId, kind: "credit", euros: +(euros.toFixed(2)), reason, at: Date.now(), requestId: requestId || null };
  LEDGER.set(entry.id, entry);
  return { wallet: w, entry };
}

export function debit(ownerId: string, euros: number, reason: string, requestId?: string | null): { wallet: Wallet; entry: LedgerEntry } {
  if (!(euros > 0)) throw new Error("NON_POSITIVE_DEBIT");
  const w = getWallet(ownerId);
  const next = +(w.euros - euros).toFixed(2);
  if (next < 0) throw new Error("INSUFFICIENT_FUNDS");
  w.euros = next;
  w.updatedAt = Date.now();

  const entry: LedgerEntry = { id: rid(), ownerId, kind: "debit", euros: +(euros.toFixed(2)), reason, at: Date.now(), requestId: requestId || null };
  LEDGER.set(entry.id, entry);
  return { wallet: w, entry };
}
