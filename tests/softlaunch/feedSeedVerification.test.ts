import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateFeedSeedVerification } from "@/lib/softlaunch/feedSeedVerification";

describe("soft-launch feed seed verification", () => {
  it("passes valid feed seed set", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/feed-seed.json", "utf8"));
    const out = evaluateFeedSeedVerification({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.active).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateFeedSeedVerification({
      items: [
        { id: "x", portal: "FYP", title: "A", category: "featured", active: true, score: 0.9 },
        { id: "x", portal: "FYP", title: "B", category: "featured", active: true, score: 0.8 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid score", () => {
    const out = evaluateFeedSeedVerification({
      items: [
        { id: "x", portal: "FYP", title: "A", category: "featured", active: true, score: 2 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_score" });
  });

  it("rejects missing items", () => {
    const out = evaluateFeedSeedVerification({ items: [] });
    expect(out).toEqual({ ok: false, reason: "missing_items" });
  });
});
