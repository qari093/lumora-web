import { describe, expect, it } from "vitest";
import {
  getZendoroActivationSummary,
  zendoroActivationSurfaces
} from "../../src/core/founder-activation/zendoroActivation";

describe("Zendoro founder activation", () => {
  it("provides visible Zendoro commerce surfaces", () => {
    expect(zendoroActivationSurfaces.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps Zendoro in founder-safe mode", () => {
    const summary = getZendoroActivationSummary();

    expect(summary.status).toBe("ZENDORO_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.checkoutLive).toBe(false);
    expect(summary.payoutsLive).toBe(false);
    expect(summary.testerInvitesBlocked).toBe(true);
  });
});
