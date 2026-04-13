import { describe, expect, it } from "vitest";
import { createLogEvent } from "@/lib/system/logging";

describe("logging & monitoring hooks", () => {
  it("creates valid info log", () => {
    const out = createLogEvent({
      level: "info",
      message: "FYP loaded",
      context: { portal: "FYP" },
      ts: Date.now(),
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.event.level).toBe("info");
      expect(out.event.context.portal).toBe("FYP");
    }
  });

  it("creates error log with auto timestamp", () => {
    const out = createLogEvent({
      level: "error",
      message: "API failed",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(typeof out.event.ts).toBe("number");
    }
  });

  it("rejects invalid level", () => {
    const out = createLogEvent({
      level: "debug" as any,
      message: "invalid",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_level" });
  });

  it("rejects empty message", () => {
    const out = createLogEvent({
      level: "info",
      message: "",
    });

    expect(out).toEqual({ ok: false, reason: "missing_message" });
  });

  it("rejects too long message", () => {
    const out = createLogEvent({
      level: "info",
      message: "x".repeat(600),
    });

    expect(out).toEqual({ ok: false, reason: "message_too_long" });
  });
});
