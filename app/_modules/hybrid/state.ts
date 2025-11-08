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
