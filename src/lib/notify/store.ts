export type NotifyKind = "low_balance" | "spend_spike" | "approval" | "generic";
export type Subscription = {
  ownerId: string;
  kind: NotifyKind;
  thresholdEuros?: number | null; // for low_balance, etc.
  createdAt: number;
  updatedAt: number;
};
export type Notification = {
  id: string;
  ownerId: string;
  kind: NotifyKind;
  title: string;
  body?: string | null;
  createdAt: number;
  read: boolean;
  meta?: any;
};

declare global {
  // eslint-disable-next-line no-var
  var __NOTIFY_SUBS: Map<string, Subscription> | undefined;
  // eslint-disable-next-line no-var
  var __NOTIFY_INBOX: Map<string, Notification> | undefined;
}
const SUBS: Map<string, Subscription> = (globalThis.__NOTIFY_SUBS ||= new Map());
const INBOX: Map<string, Notification> = (globalThis.__NOTIFY_INBOX ||= new Map());

function sid(ownerId: string, kind: NotifyKind) { return `${ownerId}::${kind}`; }
function nid() { return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10); }

export function upsertSubscription(ownerId: string, kind: NotifyKind, thresholdEuros?: number | null): Subscription {
  const key = sid(ownerId, kind);
  const now = Date.now();
  const prev = SUBS.get(key);
  const sub: Subscription = prev
    ? { ...prev, thresholdEuros: thresholdEuros ?? prev.thresholdEuros ?? null, updatedAt: now }
    : { ownerId, kind, thresholdEuros: thresholdEuros ?? null, createdAt: now, updatedAt: now };
  SUBS.set(key, sub);
  return sub;
}

export function listSubscriptions(ownerId: string): Subscription[] {
  return Array.from(SUBS.values()).filter(s => s.ownerId === ownerId);
}

export function emitNotification(ownerId: string, kind: NotifyKind, title: string, body?: string | null, meta?: any): Notification {
  const n: Notification = { id: nid(), ownerId, kind, title, body: body || null, createdAt: Date.now(), read: false, meta };
  INBOX.set(n.id, n);
  return n;
}

export function listInbox(ownerId: string, limit = 50): Notification[] {
  return Array.from(INBOX.values())
    .filter(n => n.ownerId === ownerId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function getLowBalanceThreshold(ownerId: string): number | null {
  const sub = SUBS.get(sid(ownerId, "low_balance"));
  if (!sub) return null;
  const v = sub.thresholdEuros;
  if (typeof v === "number" && isFinite(v) && v >= 0) return v;
  return null;
}
