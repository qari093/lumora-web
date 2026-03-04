import crypto from "crypto";

export type LiveRoom = {
  id: string;
  title: string;
  viewers: number;
  createdAt: number;
  updatedAt: number;
  lastPublishAt: number;
  lastEventAt: number; // ms
};

type Subscriber = {
  id: string;
  write: (chunk: string) => void;
};

const rooms = new Map<string, LiveRoom>();
const subs = new Map<string, Subscriber>();

function now(): number {
  return Date.now();
}

function uuid(): string {
  // crypto.randomUUID is available in Node 18+, keep fallback for safety
  const anyCrypto: any = crypto as any;
  if (typeof anyCrypto.randomUUID === "function") return anyCrypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function ensureSeeded() {
  if (rooms.size > 0) return;
  const base = now();
  const seed: LiveRoom[] = [
    { id: "demo-room", title: "demo-room", viewers: 0, createdAt: base - 1000, updatedAt: base - 1000, lastPublishAt: base - 1000, lastEventAt: base - 1000 },
    { id: "demo-room-1", title: "Demo Room 1", viewers: 11, createdAt: base - 2000, updatedAt: base - 2000, lastPublishAt: base - 2000, lastEventAt: base - 2000 },
    { id: "demo-room-2", title: "Demo Room 2", viewers: 12, createdAt: base - 3000, updatedAt: base - 3000, lastPublishAt: base - 3000, lastEventAt: base - 3000 },
    { id: "demo-room-3", title: "Demo Room 3", viewers: 13, createdAt: base - 4000, updatedAt: base - 4000, lastPublishAt: base - 4000, lastEventAt: base - 4000 },
    { id: "demo-room-4", title: "Demo Room 4", viewers: 14, createdAt: base - 5000, updatedAt: base - 5000, lastPublishAt: base - 5000, lastEventAt: base - 5000 },
    { id: "demo-room-5", title: "Demo Room 5", viewers: 15, createdAt: base - 6000, updatedAt: base - 6000, lastPublishAt: base - 6000, lastEventAt: base - 6000 },
  ];
  for (const r of seed) rooms.set(r.id, r);
}

export function listRooms(): LiveRoom[] {
  ensureSeeded();
  return Array.from(rooms.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getRoomState(roomId: string): LiveRoom {
  ensureSeeded();
  const existing = rooms.get(roomId);
  if (existing) return existing;
  const t = now();
  const created: LiveRoom = {
    id: roomId,
    title: roomId,
    viewers: 0,
    createdAt: t,
    updatedAt: t,
    lastPublishAt: 0,
    lastEventAt: 0,
  };
  rooms.set(roomId, created);
  return created;
}

function sseEvent(eventName: string, data: unknown): string {
  return `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
}

export function publish(roomId: string, payload: Record<string, unknown> = {}): LiveRoom {
  const r = getRoomState(roomId);
  const t = now();
  r.updatedAt = t;
  r.lastPublishAt = t;
  r.lastEventAt = t;

  // Broadcast as contract-expected event name: "event"
  const msg = {
    ok: true,
    kind: "event",
    type: "publish",
    roomid: roomId,
    roomId,
    updatedat: t,
    updatedAt: t,
    lastpublishat: t,
    lastPublishAt: t,
    ...payload,
  };

  const chunk = sseEvent("event", msg);
  for (const s of subs.values()) {
    try {
      s.write(chunk);
    } catch {
      // ignore
    }
  }
  return r;
}

export function subscribeSSE(write: (chunk: string) => void): string {
  const id = uuid();
  subs.set(id, { id, write });
  return id;
}

export function unsubscribeSSE(id: string): void {
  subs.delete(id);
}

// helper for SSE route to emit connected/ping in a consistent format
export function sseConnectedChunk(): string {
  return sseEvent("connected", { ok: true });
}

export function ssePingChunk(): string {
  return sseEvent("ping", {});
}
