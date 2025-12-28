import { randomUUID } from "crypto";

export type LiveRoom = {
  id: string;
  title: string;
  createdAt: string;
  endedAt?: string | null;
  active: boolean;
};

export type LiveReactionKind = "emoji" | "avatar";

export type LiveReaction = {
  id: string;
  roomId: string;
  kind: LiveReactionKind;
  refId: string; // e.g., E001-1-0-4 or A123
  createdAt: string;
};

type Listener = (evt: LiveEvent) => void;

export type LiveEvent =
  | { type: "room"; room: LiveRoom }
  | { type: "reaction"; reaction: LiveReaction }
  | { type: "end"; roomId: string };

class LiveStore {
  private rooms = new Map<string, LiveRoom>();
  private reactions = new Map<string, LiveReaction[]>(); // roomId -> reactions
  private listeners = new Map<string, Set<Listener>>(); // roomId -> listeners

  createRoom(title?: string): LiveRoom {
    const id = `lr_${randomUUID().slice(0, 8)}_${Date.now().toString(36)}`;
    const room: LiveRoom = {
      id,
      title: (title || "Live Room").trim() || "Live Room",
      createdAt: new Date().toISOString(),
      active: true,
      endedAt: null,
    };
    this.rooms.set(id, room);
    this.reactions.set(id, []);
    this.emit(id, { type: "room", room });
    return room;
  }

  listRooms(): LiveRoom[] {
    return Array.from(this.rooms.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getRoom(id: string): LiveRoom | null {
    return this.rooms.get(id) || null;
  }

  endRoom(id: string): LiveRoom | null {
    const room = this.rooms.get(id);
    if (!room) return null;
    const next: LiveRoom = { ...room, active: false, endedAt: new Date().toISOString() };
    this.rooms.set(id, next);
    this.emit(id, { type: "end", roomId: id });
    this.emit(id, { type: "room", room: next });
    return next;
  }

  addReaction(roomId: string, kind: LiveReactionKind, refId: string): LiveReaction {
    const room = this.rooms.get(roomId);
    if (!room) {
      const err = new Error("room not found");
      (err as any).code = "ROOM_NOT_FOUND";
      throw err;
    }
    if (!room.active) {
      const err = new Error("room ended");
      (err as any).code = "ROOM_ENDED";
      throw err;
    }
    const reaction: LiveReaction = {
      id: `rx_${randomUUID().slice(0, 10)}`,
      roomId,
      kind,
      refId: String(refId || "").trim() || "unknown",
      createdAt: new Date().toISOString(),
    };
    const arr = this.reactions.get(roomId) || [];
    arr.unshift(reaction);
    // cap for v0
    if (arr.length > 200) arr.length = 200;
    this.reactions.set(roomId, arr);
    this.emit(roomId, { type: "reaction", reaction });
    return reaction;
  }

  listReactions(roomId: string): LiveReaction[] {
    return (this.reactions.get(roomId) || []).slice(0, 200);
  }

  subscribe(roomId: string, cb: Listener): () => void {
    let set = this.listeners.get(roomId);
    if (!set) {
      set = new Set();
      this.listeners.set(roomId, set);
    }
    set.add(cb);
    return () => {
      const s = this.listeners.get(roomId);
      if (!s) return;
      s.delete(cb);
      if (s.size === 0) this.listeners.delete(roomId);
    };
  }

  emit(roomId: string, evt: LiveEvent) {
    const s = this.listeners.get(roomId);
    if (!s) return;
    for (const cb of s) {
      try { cb(evt); } catch { /* ignore */ }
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __lumoraLiveStore: LiveStore | undefined;
}

export const liveStore: LiveStore =
  globalThis.__lumoraLiveStore || (globalThis.__lumoraLiveStore = new LiveStore());
