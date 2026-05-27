import { describe, expect, it } from "vitest";
import { validateRateLimit } from "@/core/security/runtime";

describe("security runtime", () => {
  it("validates rate limits", () => {
    expect(validateRateLimit(10)).toBe(true);
  });
});
