import { describe, expect, it } from "vitest";
import {
  gmarActivationItems,
  getGmarActivationSummary
} from "../../src/core/founder-activation/gmarActivation";

describe("GMAR founder activation", () => {
  it("provides visible GMAR runtime surfaces", () => {
    expect(gmarActivationItems.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps GMAR in founder-safe mode", () => {
    const summary = getGmarActivationSummary();

    expect(summary.status).toBe("GMAR_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.liveRewardsEnabled).toBe(false);
    expect(summary.testerInvitesBlocked).toBe(true);
  });
});
