type RoomListener = (payload: unknown) => void;

const listeners = new Map<string, Set<RoomListener>>();

export function subscribeRoom(
  roomId: string,
  listener: RoomListener,
): () => void {
  const key = String(roomId || "").trim();

  if (!key) {
    return () => undefined;
  }

  let roomListeners = listeners.get(key);

  if (!roomListeners) {
    roomListeners = new Set<RoomListener>();
    listeners.set(key, roomListeners);
  }

  roomListeners.add(listener);

  return () => {
    const current = listeners.get(key);
    if (!current) return;

    current.delete(listener);

    if (current.size === 0) {
      listeners.delete(key);
    }
  };
}

export function publishRoom(roomId: string, payload: unknown): number {
  const roomListeners = listeners.get(String(roomId || "").trim());

  if (!roomListeners || roomListeners.size === 0) {
    return 0;
  }

  let delivered = 0;

  for (const listener of roomListeners) {
    try {
      listener(payload);
      delivered += 1;
    } catch {
      continue;
    }
  }

  return delivered;
}
