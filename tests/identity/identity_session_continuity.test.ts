import { describe, expect, it } from "vitest";
import { createConsumerIdentity } from "@/src/core/identity/profile/consumerIdentity";
import { validateSessionContinuity } from "@/src/core/identity/session/sessionValidator";

describe("identity session continuity", () => {
  it("creates guest-safe identity", () => {
    expect(createConsumerIdentity().guest).toBe(true);
  });

  it("validates session continuity", () => {
    expect(validateSessionContinuity().ok).toBe(true);
  });
});
