import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateShareInternalLinkVerification } from "@/lib/softlaunch/shareInternalLinkVerification";

describe("soft-launch share / internal link verification", () => {
  it("passes valid internal links", () => {
    const links = JSON.parse(fs.readFileSync("data/softlaunch/internal-links.json", "utf8"));
    const out = evaluateShareInternalLinkVerification({ links });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.internalCount).toBe(4);
      expect(out.verification.validCount).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects invalid entity type", () => {
    const out = evaluateShareInternalLinkVerification({
      links: [
        { entityType: "bad", entityId: "x", href: "/share/x", internal: true }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_entity_type" });
  });

  it("rejects missing entity id", () => {
    const out = evaluateShareInternalLinkVerification({
      links: [
        { entityType: "post", entityId: "", href: "/share/post/x", internal: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "missing_entity_id" });
  });

  it("rejects invalid href", () => {
    const out = evaluateShareInternalLinkVerification({
      links: [
        { entityType: "post", entityId: "x", href: "https://external", internal: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_href" });
  });
});
