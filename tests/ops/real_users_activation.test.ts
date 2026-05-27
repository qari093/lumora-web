import { describe, expect, it } from "vitest";
import { createAlphaInvite } from "../../src/core/ops/users/alpha";
import { captureAlphaFeedback } from "../../src/core/ops/users/feedback";
import { realUsersActivationChecklist } from "../../src/core/ops/users/testing-checklist";

describe("real users activation", () => {
  it("creates alpha invites", () => {
    expect(createAlphaInvite({ email: "creator@test.local", kind: "creator" }).status).toBe("invited");
  });

  it("captures alpha feedback", () => {
    expect(captureAlphaFeedback({
      userId: "u1",
      category: "onboarding",
      message: "smooth",
    }).category).toBe("onboarding");
  });

  it("covers real user test checklist", () => {
    expect(Object.values(realUsersActivationChecklist).every(Boolean)).toBe(true);
  });
});
