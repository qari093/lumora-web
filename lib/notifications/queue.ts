export type QueueItem = {
  id: string;
  userId: string;
  payload: any;
  createdAt: number;
  delivered: boolean;
};

export type EnqueueResult =
  | { ok: true; item: QueueItem }
  | { ok: false; reason: string };

export type DequeueResult =
  | { ok: true; item: QueueItem }
  | { ok: false; reason: string };

const queue: QueueItem[] = [];

export function enqueueNotification(
  userId?: string | null,
  payload?: any,
  now: number = Date.now()
): EnqueueResult {
  const uid = typeof userId === "string" ? userId.trim() : "";
  if (!uid) return { ok: false, reason: "missing_user_id" };
  if (!payload) return { ok: false, reason: "missing_payload" };

  const item: QueueItem = {
    id: `q_${Math.random().toString(36).slice(2, 10)}`,
    userId: uid,
    payload,
    createdAt: now,
    delivered: false,
  };

  queue.push(item);
  return { ok: true, item };
}

export function dequeueNotification(): DequeueResult {
  const item = queue.find(q => !q.delivered);
  if (!item) return { ok: false, reason: "queue_empty" };

  item.delivered = true;
  return { ok: true, item };
}

export function getQueueSize(): number {
  return queue.filter(q => !q.delivered).length;
}
