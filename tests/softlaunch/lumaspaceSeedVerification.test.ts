import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateLumaSpaceSeedVerification } from "@/lib/softlaunch/lumaspaceSeedVerification";

describe("soft-launch LumaSpace seed verification", () => {
  it("passes valid LumaSpace seed set", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/lumaspace-seed.json", "utf8"));
    const out = evaluateLumaSpaceSeedVerification({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.active).toBe(4);
      expect(out.verification.usable).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateLumaSpaceSeedVerification({
      items: [
        { id: "x", portal: "LUMASPACE", title: "A", spaceType: "reflection", active: true, usable: true, score: 0.9 },
        { id: "x", portal: "LUMASPACE", title: "B", spaceType: "journal", active: true, usable: true, score: 0.8 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid space type", () => {
    const out = evaluateLumaSpaceSeedVerification({
      items: [
        { id: "x", portal: "LUMASPACE", title: "A", spaceType: "dream", active: true, usable: true, score: 0.9 }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_space_type" });
  });

  it("rejects invalid score", () => {
    const out = evaluateLumaSpaceSeedVerification({
      items: [
        { id: "x", portal: "LUMASPACE", title: "A", spaceType: "reflection", active: true, usable: true, score: 2 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_score" });
  });
});
