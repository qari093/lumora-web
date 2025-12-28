/**
 * In-memory SSE pub/sub bus (dev/test).
 * Provides both modern functions and legacy `sseBus.*` API used by older routes.
 */

export type LiveSseEventKind = "connected" | "event" | "keepalive";

export type LiveSseEnvelope = {
  roomId: string;
  kind: LiveSseEventKind;
  payload?: unknown;
  ts: number; // ms epoch
};

type Listener = (evt: LiveSseEnvelope) => void;

const g = globalThis as unknown as {
  __lumoraLiveSseBus?: Map<string, Set<Listener>>;
};

function bus(): Map<string, Set<Listener>> {
  if (!g.__lumoraLiveSseBus) g.__lumoraLiveSseBus = new Map();
  return g.__lumoraLiveSseBus;
}

function listeners(roomId: string): Set<Listener> {
  const b = bus();
  let set = b.get(roomId);
  if (!set) {
    set = new Set();
    b.set(roomId, set);
  }
  return set;
}

export function publish(roomId: string, kind: LiveSseEventKind, payload?: unknown): LiveSseEnvelope {
  const evt: LiveSseEnvelope = { roomId, kind, payload, ts: Date.now() };
  const set = listeners(roomId);
  for (const fn of Array.from(set)) {
    try { fn(evt); } catch { /* ignore */ }
  }
  return evt;
}

export function subscribe(roomId: string, fn: Listener): () => void {
  const set = listeners(roomId);
  set.add(fn);
  return () => {
    try { set.delete(fn); } catch { /* ignore */ }
  };
}

/** Back-compat alias */
export const emit = publish;

/**
 * Legacy API object expected by older /api/live/events route:
 *   import { sseBus } from "@/lib/live/sseBus"
 *   sseBus.subscribeRoom(roomId, fn)
 *   sseBus.unsubscribeRoom(roomId, fn)
 *   sseBus.publishRoom(roomId, kind, payload)
 */
export const sseBus = {
  subscribeRoom(roomId: string, fn: Listener) {
    const set = listeners(roomId);
    set.add(fn);
  },
  unsubscribeRoom(roomId: string, fn: Listener) {
    const set = listeners(roomId);
    try { set.delete(fn); } catch { /* ignore */ }
  },
  publishRoom(roomId: string, kind: LiveSseEventKind, payload?: unknown) {
    return publish(roomId, kind, payload);
  },
};
