import { describe, expect, it } from "vitest";
import { validateSession } from "@/core/auth/session-runtime";

describe("auth runtime", () => {
  it("validates sessions", () => {
    expect(validateSession({ id: "1", role: "fan" })).toBe(true);
  });
});
