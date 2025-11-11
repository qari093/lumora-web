/**
 * Hybrid state store (server-side). No default export — only named exports.
 */
type Kind = 'emoji' | 'avatar';
export type HybridItem = {
  id: string;
  kind: Kind;
  qty: number;
  ts: number;
};

const STORE = new Map<string, HybridItem>();

export function grant(id: string, kind: Kind = 'emoji', qty = 1): HybridItem {
  const prev = STORE.get(id);
  const item: HybridItem = {
    id,
    kind: prev?.kind ?? kind,
    qty: (prev?.qty ?? 0) + Math.max(0, qty),
    ts: Date.now(),
  };
  STORE.set(id, item);
  return item;
}

export function spend(id: string, qty = 1): HybridItem | null {
  const prev = STORE.get(id);
  if (!prev) return null;
  const left = Math.max(0, prev.qty - Math.max(0, qty));
  const item: HybridItem = { ...prev, qty: left, ts: Date.now() };
  if (left === 0) STORE.delete(id);
  else STORE.set(id, item);
  return item;
}

export function snapshot(): HybridItem[] {
  return Array.from(STORE.values()).map(v => ({ ...v }));
}

export function reset(): boolean {
  STORE.clear();
  return true;
}

// HYBRID_STATE_STUB — fallback in-memory implementation
type UserKey = string;

const __hybridCredits = new Map<UserKey, number>();

export function ensure(userId: UserKey): void {
  if (!__hybridCredits.has(userId)) __hybridCredits.set(userId, 0);
}

export function addCredits(userId: UserKey, amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return getCredits(userId);
  ensure(userId);
  const next = getCredits(userId) + amount;
  __hybridCredits.set(userId, next);
  return next;
}

export function spendCredit(userId: UserKey, amount: number = 1): boolean {
  ensure(userId);
  const current = getCredits(userId);
  if (current < amount || amount <= 0) return false;
  __hybridCredits.set(userId, current - amount);
  return true;
}

export function getCredits(userId: UserKey): number {
  return __hybridCredits.get(userId) ?? 0;
}

