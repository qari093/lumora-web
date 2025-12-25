export type TesterEventType = "share_open" | "telemetry";

export type TesterEvent = {
  id: string;
  type: TesterEventType;
  path?: string;
  ts: number;
};

export type TesterRow = {
  testerId: string;
  shareOpens: number;
  events: number;
  firstSeen: number;
  lastSeen: number;
};

export type StoreShape = {
  rows: Map<string, TesterRow>;
  eventsByTester: Map<string, TesterEvent[]>;
};

declare global {
  // eslint-disable-next-line no-var
  var __LUMORA_TESTER_STORE__: StoreShape | undefined;
}

function newStore(): StoreShape {
  return { rows: new Map(), eventsByTester: new Map() };
}

export function getStore(): StoreShape {
  if (!globalThis.__LUMORA_TESTER_STORE__) globalThis.__LUMORA_TESTER_STORE__ = newStore();
  return globalThis.__LUMORA_TESTER_STORE__;
}

export function resetStore(): void {
  globalThis.__LUMORA_TESTER_STORE__ = newStore();
}

function capEvents(list: TesterEvent[], max = 200): TesterEvent[] {
  return list.length <= max ? list : list.slice(list.length - max);
}

export function recordEvent(params: {
  testerId: string;
  type: TesterEventType;
  path?: string;
  ts?: number;
}): void {
  const store = getStore();
  const ts = params.ts ?? Date.now();

  const row =
    store.rows.get(params.testerId) ??
    ({
      testerId: params.testerId,
      shareOpens: 0,
      events: 0,
      firstSeen: ts,
      lastSeen: ts,
    } satisfies TesterRow);

  row.lastSeen = ts;
  if (!row.firstSeen) row.firstSeen = ts;

  if (params.type === "share_open") row.shareOpens += 1;
  row.events += 1;

  store.rows.set(params.testerId, row);

  const ev: TesterEvent = {
    id: `${ts}_${Math.random().toString(16).slice(2)}`,
    type: params.type,
    path: params.path,
    ts,
  };

  const list = store.eventsByTester.get(params.testerId) ?? [];
  list.push(ev);
  store.eventsByTester.set(params.testerId, capEvents(list));
}

export function snapshotRows(): TesterRow[] {
  return Array.from(getStore().rows.values());
}
