export type LiveEventKind = "connected" | "event" | "persona" | "reset";

export type LiveEvent = {
  roomId: string;
  kind: LiveEventKind;
  ts: string; // ISO
  payload?: Record<string, unknown> | null;
};

export type LiveRoomState = {
  roomId: string;
  lastEventAt: string | null;
  lastPersonaAt: string | null;
  resetAt: string; // ISO
};

type Subscriber = (ev: LiveEvent) => void;

class LiveBus {
  private subsByRoom = new Map<string, Set<Subscriber>>();
  private stateByRoom = new Map<string, LiveRoomState>();

  getRoomState(roomId: string): LiveRoomState {
    const id = roomId || "demo-room";
    const existing = this.stateByRoom.get(id);
    if (existing) return existing;

    const now = new Date();
    const resetAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const s: LiveRoomState = { roomId: id, lastEventAt: null, lastPersonaAt: null, resetAt };
    this.stateByRoom.set(id, s);
    return s;
  }

  private ensureSubs(roomId: string): Set<Subscriber> {
    const id = roomId || "demo-room";
    let set = this.subsByRoom.get(id);
    if (!set) {
      set = new Set<Subscriber>();
      this.subsByRoom.set(id, set);
    }
    return set;
  }

  subscribe(roomId: string, fn: Subscriber): () => void {
    const set = this.ensureSubs(roomId);
    set.add(fn);
    return () => {
      set.delete(fn);
      if (set.size === 0) this.subsByRoom.delete(roomId);
    };
  }

  publish(roomId: string, kind: Exclude<LiveEventKind, "connected">, payload?: Record<string, unknown> | null): LiveEvent {
    const id = roomId || "demo-room";
    const ts = new Date().toISOString();
    const ev: LiveEvent = { roomId: id, kind, ts, payload: payload ?? null };

    const s = this.getRoomState(id);
    if (kind === "event") s.lastEventAt = ts;
    if (kind === "persona") s.lastPersonaAt = ts;
    if (kind === "reset") {
      s.lastEventAt = null;
      s.lastPersonaAt = null;
      s.resetAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }
    this.stateByRoom.set(id, s);

    const subs = this.subsByRoom.get(id);
    if (subs) {
      for (const fn of subs) {
        try { fn(ev); } catch { /* swallow */ }
      }
    }
    return ev;
  }
}

// Dev hot-reload safe singleton
declare global {
  // eslint-disable-next-line no-var
  var __lumoraLiveBus: LiveBus | undefined;
}

export function getLiveBus(): LiveBus {
  if (!globalThis.__lumoraLiveBus) globalThis.__lumoraLiveBus = new LiveBus();
  return globalThis.__lumoraLiveBus;
}
