import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateDataIntegrityGlobalVerification } from "@/lib/softlaunch/dataIntegrityGlobalVerification";

describe("soft-launch global data integrity verification", () => {
  it("passes valid dataset", () => {
    const entities = JSON.parse(fs.readFileSync("data/softlaunch/data-integrity.json", "utf8"));
    const out = evaluateDataIntegrityGlobalVerification({ entities });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.valid).toBe(3);
      expect(out.verification.consistent).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateDataIntegrityGlobalVerification({
      entities: [
        { id: "1", type: "wallet", checksum: "abcd1234", valid: true },
        { id: "1", type: "feed", checksum: "abcd5678", valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid checksum", () => {
    const out = evaluateDataIntegrityGlobalVerification({
      entities: [
        { id: "1", type: "wallet", checksum: "bad", valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_checksum" });
  });
});
