import { describe, expect, it } from "vitest";
import { createComment } from "@/lib/comments/core";

describe("comment system core", () => {
  const now = 1_700_000_000_000;

  it("creates a valid comment", () => {
    const out = createComment(
      {
        entityId: "video_1",
        userId: "user_1",
        body: " Great post ",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.comment.entityId).toBe("video_1");
      expect(out.comment.userId).toBe("user_1");
      expect(out.comment.body).toBe("Great post");
      expect(out.comment.createdAt).toBe(now);
    }
  });

  it("rejects missing entity id", () => {
    const out = createComment({ entityId: "", userId: "user_1", body: "Hi" }, now);
    expect(out).toEqual({ ok: false, reason: "missing_entity_id" });
  });

  it("rejects missing user id", () => {
    const out = createComment({ entityId: "video_1", userId: "", body: "Hi" }, now);
    expect(out).toEqual({ ok: false, reason: "missing_user_id" });
  });

  it("rejects empty body", () => {
    const out = createComment({ entityId: "video_1", userId: "user_1", body: "   " }, now);
    expect(out).toEqual({ ok: false, reason: "empty_body" });
  });

  it("rejects overly long body", () => {
    const out = createComment({
      entityId: "video_1",
      userId: "user_1",
      body: "a".repeat(501),
    }, now);
    expect(out).toEqual({ ok: false, reason: "body_too_long" });
  });
});
