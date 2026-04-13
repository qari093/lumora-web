import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateSanitizationValidationVerification } from "@/lib/softlaunch/sanitizationValidationVerification";

describe("soft-launch sanitization + validation verification", () => {
  it("passes valid sanitized samples", () => {
    const samples = JSON.parse(fs.readFileSync("data/softlaunch/sanitization-validation.json", "utf8"));
    const out = evaluateSanitizationValidationVerification({ samples });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.valid).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateSanitizationValidationVerification({
      samples: [
        { id: "x", field: "comment", input: "a", sanitized: "a", valid: true },
        { id: "x", field: "title", input: "b", sanitized: "b", valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects missing field", () => {
    const out = evaluateSanitizationValidationVerification({
      samples: [
        { id: "x", field: "", input: "a", sanitized: "a", valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "missing_field" });
  });

  it("rejects unsanitized markup", () => {
    const out = evaluateSanitizationValidationVerification({
      samples: [
        { id: "x", field: "comment", input: "<b>a</b>", sanitized: "<b>a</b>", valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "unsanitized_markup" });
  });
});
