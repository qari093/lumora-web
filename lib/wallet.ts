// lib/wallet.ts — unified global in-memory store that survives Next.js HMR

export type Wallet = { ownerId: string; euros: number; updatedAt: number };
export type LedgerEntry = {
  id: string;
  ownerId: string;
  kind: 'credit' | 'debit' | 'topup';
  euros: number;         // always positive; sign implied by kind
  reason?: string;
  at: number;
  requestId: string;
};

type Store = {
  wallets: Map<string, Wallet>;
  ledgers: Map<string, LedgerEntry[]>;
};

// --- GLOBAL SINGLETON (prevents resets across hot reloads / route workers) ---
const G = globalThis as any;
if (!G.__WALLET_STORE__) {
  G.__WALLET_STORE__ = {
    wallets: new Map<string, Wallet>(),
    ledgers: new Map<string, LedgerEntry[]>(),
  } as Store;
}
const STORE: Store = G.__WALLET_STORE__;

// --- READ HELPERS ------------------------------------------------------------

/** Get or create a wallet for an owner */
export async function getWallet(ownerId: string): Promise<Wallet> {
  if (!ownerId) throw new Error('ownerId required');
  let w = STORE.wallets.get(ownerId);
  if (!w) {
    w = { ownerId, euros: 0, updatedAt: Date.now() };
    STORE.wallets.set(ownerId, w);
  }
  return w;
}

/** Current numeric balance (euros) for convenience */
export async function getBalance(ownerId: string): Promise<number> {
  const w = await getWallet(ownerId);
  return w.euros;
}

/** Full ledger (most-recent first) */
export async function getLedger(ownerId: string): Promise<LedgerEntry[]> {
  const arr = STORE.ledgers.get(ownerId) ?? [];
  // return a copy in reverse-chronological order
  return [...arr].sort((a, b) => b.at - a.at);
}

// --- WRITE HELPERS -----------------------------------------------------------

function pushLedger(ownerId: string, entry: LedgerEntry) {
  const arr = STORE.ledgers.get(ownerId) ?? [];
  arr.push(entry);
  STORE.ledgers.set(ownerId, arr);
}

/**
 * Add a ledger entry and mutate the wallet balance.
 * - kind: 'credit' | 'topup' => add; 'debit' => subtract (guard against negative)
 * - euros must be a positive number; sign comes from kind
 */
export async function addLedgerEntry(opts: {
  ownerId: string;
  kind: 'credit' | 'debit' | 'topup';
  euros: number;          // positive value
  reason?: string;
}): Promise<LedgerEntry> {
  const { ownerId, kind, euros, reason } = opts;

  if (!ownerId || typeof euros !== 'number' || !Number.isFinite(euros) || euros <= 0) {
    throw new Error('Invalid payload');
  }

  const wallet = await getWallet(ownerId);
  const amt = Math.abs(Number(euros));

  // Compute delta & checks
  let delta = 0;
  switch (kind) {
    case 'credit':
    case 'topup':
      delta = amt;               // add
      break;
    case 'debit':
      delta = -amt;              // subtract
      if (wallet.euros + delta < 0) {
        throw new Error('Insufficient funds');
      }
      break;
    default:
      // Type guard, but keep a runtime check
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown kind: ${kind}`);
  }

  // Apply
  wallet.euros = Number((wallet.euros + delta).toFixed(2));
  wallet.updatedAt = Date.now();

  // Record entry (store absolute amount; sign implied by kind)
  const entry: LedgerEntry = {
    id: Math.random().toString(36).slice(2),
    ownerId,
    kind,
    euros: amt,
    reason,
    at: Date.now(),
    requestId: Math.random().toString(36).slice(2),
  };

  pushLedger(ownerId, entry);
  return entry;
}

// --- (Optional) test utilities you can use locally ---------------------------
/** Clear an owner's wallet & ledger (useful for local tests) */
export async function _resetOwner(ownerId: string) {
  STORE.wallets.delete(ownerId);
  STORE.ledgers.delete(ownerId);
}
/** Clear everything (ALL owners) */
export async function _resetAll() {
  STORE.wallets.clear();
  STORE.ledgers.clear();
}