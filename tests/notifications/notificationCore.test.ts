import { describe, expect, it } from "vitest";
import { createNotification } from "@/lib/notifications/core";

describe("notification system core", () => {
  const now = 1_700_000_000_000;

  it("creates a valid notification", () => {
    const out = createNotification(
      {
        userId: "user_1",
        actorId: "user_2",
        type: "comment",
        entityId: "video_1",
        message: "  commented on your post  ",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.notification.userId).toBe("user_1");
      expect(out.notification.actorId).toBe("user_2");
      expect(out.notification.type).toBe("comment");
      expect(out.notification.entityId).toBe("video_1");
      expect(out.notification.message).toBe("commented on your post");
      expect(out.notification.read).toBe(false);
      expect(out.notification.createdAt).toBe(now);
    }
  });

  it("rejects missing user id", () => {
    const out = createNotification({
      userId: "",
      actorId: "user_2",
      type: "like",
      entityId: "video_1",
      message: "liked your post",
    });
    expect(out).toEqual({ ok: false, reason: "missing_user_id" });
  });

  it("rejects missing type", () => {
    const out = createNotification({
      userId: "user_1",
      actorId: "user_2",
      entityId: "video_1",
      message: "liked your post",
    });
    expect(out).toEqual({ ok: false, reason: "missing_type" });
  });

  it("rejects missing message", () => {
    const out = createNotification({
      userId: "user_1",
      actorId: "user_2",
      type: "share",
      entityId: "video_1",
      message: "   ",
    });
    expect(out).toEqual({ ok: false, reason: "missing_message" });
  });

  it("rejects too long message", () => {
    const out = createNotification({
      userId: "user_1",
      actorId: "user_2",
      type: "system",
      entityId: "system_1",
      message: "a".repeat(241),
    });
    expect(out).toEqual({ ok: false, reason: "message_too_long" });
  });
});
