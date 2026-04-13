import { describe, expect, it } from "vitest";
import { sanitizeText } from "@/lib/system/sanitization";

describe("data validation & sanitization", () => {
  it("sanitizes simple text", () => {
    const out = sanitizeText({
      text: "  hello   world  ",
      maxLength: 50,
      allowNewlines: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.value).toBe("hello world");
    }
  });

  it("removes script tags and angle brackets", () => {
    const out = sanitizeText({
      text: '<script>alert("x")</script><b>Hello</b>',
      maxLength: 50,
      allowNewlines: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.value).toBe("bHello/b");
    }
  });

  it("rejects empty sanitized value", () => {
    const out = sanitizeText({
      text: "   ",
      maxLength: 10,
      allowNewlines: false,
    });

    expect(out).toEqual({ ok: false, reason: "empty_value" });
  });

  it("rejects overlong value", () => {
    const out = sanitizeText({
      text: "a".repeat(51),
      maxLength: 50,
      allowNewlines: false,
    });

    expect(out).toEqual({ ok: false, reason: "value_too_long" });
  });

  it("rejects invalid max length", () => {
    const out = sanitizeText({
      text: "hello",
      maxLength: 0,
      allowNewlines: false,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_max_length" });
  });
});
