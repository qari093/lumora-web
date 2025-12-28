export type LiveRoomPersonaState = {
  roomId: string;
  persona: {
    avatarId: string | null; // "neutral/avatar_001.png"
    emojiId: string | null;  // "emoji_001.png"
  };
  updatedAt: string; // ISO
};

const mem = new Map<string, LiveRoomPersonaState>();

export function getRoomState(roomId: string): LiveRoomPersonaState {
  const now = new Date().toISOString();
  const existing = mem.get(roomId);
  if (existing) return existing;
  const fresh: LiveRoomPersonaState = {
    roomId,
    persona: { avatarId: null, emojiId: null },
    updatedAt: now,
  };
  mem.set(roomId, fresh);
  return fresh;
}

export function setRoomState(roomId: string, persona: LiveRoomPersonaState["persona"]): LiveRoomPersonaState {
  const now = new Date().toISOString();
  const next: LiveRoomPersonaState = {
    roomId,
    persona: {
      avatarId: persona.avatarId ?? null,
      emojiId: persona.emojiId ?? null,
    },
    updatedAt: now,
  };
  mem.set(roomId, next);
  return next;
}
