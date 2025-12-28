export type LiveEvent =
  | { type: "persona_update"; roomId: string; payload: { avatarId: string | null; emojiId: string | null }; ts: string }
  | { type: "mic"; roomId: string; payload: { enabled: boolean; level: number; speaking: boolean }; ts: string };

type Listener = (e: LiveEvent) => void;

const listenersByRoom = new Map<string, Set<Listener>>();

export function emitLiveEvent(roomId: string, e: LiveEvent) {
  const set = listenersByRoom.get(roomId);
  if (!set || set.size === 0) return;
  for (const fn of set) {
    try { fn(e); } catch {}
  }
}

export function subscribeLiveEvents(roomId: string, fn: Listener) {
  let set = listenersByRoom.get(roomId);
  if (!set) { set = new Set(); listenersByRoom.set(roomId, set); }
  set.add(fn);
  return () => {
    const s = listenersByRoom.get(roomId);
    if (!s) return;
    s.delete(fn);
    if (s.size === 0) listenersByRoom.delete(roomId);
  };
}
