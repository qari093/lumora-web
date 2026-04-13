import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateErrorLoggingVerification } from "@/lib/softlaunch/errorLoggingVerification";

describe("soft-launch error logging verification", () => {
  it("passes valid captured errors", () => {
    const records = JSON.parse(fs.readFileSync("data/softlaunch/error-logging.json", "utf8"));
    const out = evaluateErrorLoggingVerification({ records });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.captured).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateErrorLoggingVerification({
      records: [
        { id: "e1", level: "error", message: "x", source: "fyp", captured: true },
        { id: "e1", level: "error", message: "y", source: "live", captured: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid level", () => {
    const out = evaluateErrorLoggingVerification({
      records: [
        { id: "e1", level: "warn" as any, message: "x", source: "fyp", captured: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_level" });
  });

  it("rejects missing message", () => {
    const out = evaluateErrorLoggingVerification({
      records: [
        { id: "e1", level: "error", message: "", source: "fyp", captured: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "missing_message" });
  });
});
