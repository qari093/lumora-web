import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateVideosPortalSeedVerification } from "@/lib/softlaunch/videosPortalSeedVerification";

describe("soft-launch videos portal seed verification", () => {
  it("passes valid videos portal seed set", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/videos-portal-seed.json", "utf8"));
    const out = evaluateVideosPortalSeedVerification({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.active).toBe(4);
      expect(out.verification.portalsCovered).toBe(2);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateVideosPortalSeedVerification({
      items: [
        { id: "x", portal: "MOVIES", title: "A", mediaType: "video", active: true, durationSec: 30, score: 0.9 },
        { id: "x", portal: "MUSIC", title: "B", mediaType: "track", active: true, durationSec: 60, score: 0.8 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid media type", () => {
    const out = evaluateVideosPortalSeedVerification({
      items: [
        { id: "x", portal: "MOVIES", title: "A", mediaType: "podcast", active: true, durationSec: 30, score: 0.9 }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_media_type" });
  });

  it("rejects invalid duration", () => {
    const out = evaluateVideosPortalSeedVerification({
      items: [
        { id: "x", portal: "MOVIES", title: "A", mediaType: "video", active: true, durationSec: 0, score: 0.9 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_duration" });
  });
});
