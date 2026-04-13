import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateGmarSeedVerification } from "@/lib/softlaunch/gmarSeedVerification";

describe("soft-launch GMAR seed verification", () => {
  it("passes valid GMAR seed set", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/gmar-seed.json", "utf8"));
    const out = evaluateGmarSeedVerification({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.active).toBe(4);
      expect(out.verification.playerReady).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateGmarSeedVerification({
      items: [
        { id: "x", portal: "GMAR", title: "A", gameType: "challenge", active: true, playerReady: true, score: 0.9 },
        { id: "x", portal: "GMAR", title: "B", gameType: "event", active: true, playerReady: true, score: 0.8 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid game type", () => {
    const out = evaluateGmarSeedVerification({
      items: [
        { id: "x", portal: "GMAR", title: "A", gameType: "raid", active: true, playerReady: true, score: 0.9 }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_game_type" });
  });

  it("rejects invalid score", () => {
    const out = evaluateGmarSeedVerification({
      items: [
        { id: "x", portal: "GMAR", title: "A", gameType: "challenge", active: true, playerReady: true, score: 2 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_score" });
  });
});
