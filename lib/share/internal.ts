export type SharePayload = {
  fromUserId?: string | null;
  toUserId?: string | null;
  entityId?: string | null;
  entityType?: "video" | "post" | "live" | "gmar" | "nexa";
};

export type ShareResult =
  | { ok: true; share: { id: string; fromUserId: string; toUserId: string; entityId: string; entityType: string; createdAt: number } }
  | { ok: false; reason: string };

export function createInternalShare(
  input: SharePayload,
  now: number = Date.now()
): ShareResult {
  const fromUserId = typeof input.fromUserId === "string" ? input.fromUserId.trim() : "";
  const toUserId = typeof input.toUserId === "string" ? input.toUserId.trim() : "";
  const entityId = typeof input.entityId === "string" ? input.entityId.trim() : "";
  const entityType = input.entityType;

  if (!fromUserId) return { ok: false, reason: "missing_from_user" };
  if (!toUserId) return { ok: false, reason: "missing_to_user" };
  if (fromUserId === toUserId) return { ok: false, reason: "self_share_not_allowed" };
  if (!entityId) return { ok: false, reason: "missing_entity_id" };
  if (!entityType) return { ok: false, reason: "missing_entity_type" };

  return {
    ok: true,
    share: {
      id: `s_${Math.random().toString(36).slice(2, 10)}`,
      fromUserId,
      toUserId,
      entityId,
      entityType,
      createdAt: now,
    },
  };
}
