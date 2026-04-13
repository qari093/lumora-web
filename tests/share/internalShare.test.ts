import { describe, expect, it } from "vitest";
import { createInternalShare } from "@/lib/share/internal";

describe("internal share system", () => {
  const now = 1_700_000_000_000;

  it("creates a valid share", () => {
    const out = createInternalShare(
      {
        fromUserId: "user_1",
        toUserId: "user_2",
        entityId: "video_1",
        entityType: "video",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.share.fromUserId).toBe("user_1");
      expect(out.share.toUserId).toBe("user_2");
      expect(out.share.entityId).toBe("video_1");
    }
  });

  it("rejects self share", () => {
    const out = createInternalShare({
      fromUserId: "user_1",
      toUserId: "user_1",
      entityId: "video_1",
      entityType: "video",
    });
    expect(out).toEqual({ ok: false, reason: "self_share_not_allowed" });
  });

  it("rejects missing entity", () => {
    const out = createInternalShare({
      fromUserId: "user_1",
      toUserId: "user_2",
      entityId: "",
      entityType: "video",
    });
    expect(out).toEqual({ ok: false, reason: "missing_entity_id" });
  });

  it("rejects missing type", () => {
    const out = createInternalShare({
      fromUserId: "user_1",
      toUserId: "user_2",
      entityId: "video_1",
    });
    expect(out).toEqual({ ok: false, reason: "missing_entity_type" });
  });
});
