export type CommentRecord = {
  id: string;
  entityId: string;
  userId: string;
  body: string;
  createdAt: number;
};

export type CreateCommentInput = {
  entityId?: string | null;
  userId?: string | null;
  body?: string | null;
};

export type CreateCommentResult =
  | { ok: true; comment: CommentRecord }
  | { ok: false; reason: string };

const MAX_COMMENT_LENGTH = 500;

function normalizeBody(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function createComment(
  input: CreateCommentInput,
  now: number = Date.now()
): CreateCommentResult {
  const entityId = typeof input.entityId === "string" ? input.entityId.trim() : "";
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const rawBody = typeof input.body === "string" ? input.body : "";
  const body = normalizeBody(rawBody);

  if (!entityId) return { ok: false, reason: "missing_entity_id" };
  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!body) return { ok: false, reason: "empty_body" };
  if (body.length > MAX_COMMENT_LENGTH) {
    return { ok: false, reason: "body_too_long" };
  }

  const comment: CommentRecord = {
    id: `c_${Math.random().toString(36).slice(2, 10)}`,
    entityId,
    userId,
    body,
    createdAt: now,
  };

  return { ok: true, comment };
}
