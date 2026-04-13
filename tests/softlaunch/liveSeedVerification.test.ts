import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateLiveSeedVerification } from "@/lib/softlaunch/liveSeedVerification";

describe("soft-launch LIVE seed verification", () => {
  it("passes valid LIVE seed set", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/live-seed.json", "utf8"));
    const out = evaluateLiveSeedVerification({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.active).toBe(4);
      expect(out.verification.joinable).toBe(4);
      expect(out.verification.hostReady).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateLiveSeedVerification({
      items: [
        { id: "x", portal: "LIVE", title: "A", roomType: "audio", active: true, joinable: true, hostReady: true, score: 0.9 },
        { id: "x", portal: "LIVE", title: "B", roomType: "video", active: true, joinable: true, hostReady: true, score: 0.8 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid room type", () => {
    const out = evaluateLiveSeedVerification({
      items: [
        { id: "x", portal: "LIVE", title: "A", roomType: "spaces", active: true, joinable: true, hostReady: true, score: 0.9 }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_room_type" });
  });

  it("rejects invalid score", () => {
    const out = evaluateLiveSeedVerification({
      items: [
        { id: "x", portal: "LIVE", title: "A", roomType: "audio", active: true, joinable: true, hostReady: true, score: -1 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_score" });
  });
});
