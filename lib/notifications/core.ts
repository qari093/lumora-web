export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "share"
  | "system";

export type NotificationInput = {
  userId?: string | null;
  actorId?: string | null;
  type?: NotificationType | null;
  entityId?: string | null;
  message?: string | null;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  actorId: string;
  type: NotificationType;
  entityId: string;
  message: string;
  createdAt: number;
  read: boolean;
};

export type NotificationResult =
  | { ok: true; notification: NotificationRecord }
  | { ok: false; reason: string };

const MAX_MESSAGE_LENGTH = 240;

function normalize(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function createNotification(
  input: NotificationInput,
  now: number = Date.now()
): NotificationResult {
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const actorId = typeof input.actorId === "string" ? input.actorId.trim() : "";
  const entityId = typeof input.entityId === "string" ? input.entityId.trim() : "";
  const message = typeof input.message === "string" ? normalize(input.message) : "";
  const type = input.type ?? null;

  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!actorId) return { ok: false, reason: "missing_actor_id" };
  if (!type) return { ok: false, reason: "missing_type" };
  if (!entityId) return { ok: false, reason: "missing_entity_id" };
  if (!message) return { ok: false, reason: "missing_message" };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, reason: "message_too_long" };
  }

  return {
    ok: true,
    notification: {
      id: `n_${Math.random().toString(36).slice(2, 10)}`,
      userId,
      actorId,
      type,
      entityId,
      message,
      createdAt: now,
      read: false,
    },
  };
}
