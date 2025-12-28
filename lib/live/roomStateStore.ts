export type LiveRoomState = {
  roomId: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  updatedAt: number;      // epoch ms
  lastEventAt: string | null; // ISO
};

type Store = Map<string, LiveRoomState>;

const store: Store = new Map();

function nowMs(): number {
  return Date.now();
}

function isoNow(): string {
  return new Date().toISOString();
}

function normRoomId(x: unknown): string {
  return String(x ?? "").trim().toLowerCase();
}

export function ensureRoom(roomIdRaw: unknown, titleRaw?: unknown): LiveRoomState {
  const roomId = normRoomId(roomIdRaw);
  if (!roomId) throw new Error("roomId required");
  const existing = store.get(roomId);
  if (existing) return existing;

  const title = String(titleRaw ?? roomId);
  const s: LiveRoomState = {
    roomId,
    title,
    isLive: false,
    viewerCount: 0,
    updatedAt: nowMs(),
    lastEventAt: null,
  };
  store.set(roomId, s);
  return s;
}

export function getRoom(roomIdRaw: unknown): LiveRoomState | null {
  const roomId = normRoomId(roomIdRaw);
  if (!roomId) return null;
  return store.get(roomId) ?? null;
}

export function getOrCreateRoom(roomIdRaw: unknown, titleRaw?: unknown): LiveRoomState {
  try {
    return ensureRoom(roomIdRaw, titleRaw);
  } catch {
    // should never happen with norm, but keep safe
    return ensureRoom(String(roomIdRaw ?? "demo-room"), titleRaw);
  }
}

export function listRooms(): LiveRoomState[] {
  return Array.from(store.values()).sort((a, b) => (b.updatedAt - a.updatedAt));
}

export function activeRoomsCount(): number {
  let n = 0;
  for (const r of store.values()) if (r.isLive) n++;
  return n;
}

export function bumpRoomLastEventAt(roomIdRaw: unknown): string {
  const r = getOrCreateRoom(roomIdRaw);
  const ts = isoNow();
  r.lastEventAt = ts;
  r.updatedAt = nowMs();
  store.set(r.roomId, r);
  return ts;
}

export function updateRoom(roomIdRaw: unknown, patch: Partial<LiveRoomState>): LiveRoomState {
  const r = getOrCreateRoom(roomIdRaw);
  const next: LiveRoomState = {
    ...r,
    ...patch,
    roomId: r.roomId, // immutable
    updatedAt: nowMs(),
  };
  store.set(next.roomId, next);
  return next;
}

// Seed demo room (idempotent)
try { ensureRoom("demo-room", "demo-room"); } catch {}

// Legacy export aliases (routes expect these names)

export const ensure = ensureRoom;

export const get = getRoom;

export const list = listRooms;
