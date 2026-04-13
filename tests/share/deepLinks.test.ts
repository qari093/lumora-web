import { describe, expect, it } from "vitest";
import { buildExternalShareLink } from "@/lib/share/deepLinks";

describe("external share deep links", () => {
  it("builds a valid link with slug", () => {
    const out = buildExternalShareLink({
      entityType: "video",
      entityId: "vid_1",
      slug: "astro-shooter",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.url).toBe("https://lumora.app/share/video/vid_1/astro-shooter");
    }
  });

  it("builds a valid link without slug", () => {
    const out = buildExternalShareLink({
      entityType: "live",
      entityId: "room_1",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.url).toBe("https://lumora.app/share/live/room_1");
    }
  });

  it("rejects missing entity type", () => {
    const out = buildExternalShareLink({
      entityId: "vid_1",
      slug: "x",
    });

    expect(out).toEqual({ ok: false, reason: "missing_entity_type" });
  });

  it("rejects missing entity id", () => {
    const out = buildExternalShareLink({
      entityType: "video",
      entityId: " ",
    });

    expect(out).toEqual({ ok: false, reason: "missing_entity_id" });
  });
});
