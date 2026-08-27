import { describe, expect, it } from "vitest";
import {
  applyLumoraSecurityHeaders,
  shouldApplyLumoraHsts,
} from "../../middleware";

describe("security headers HSTS contract", () => {
  it("does not enable HSTS in ordinary development", () => {
    expect(
      shouldApplyLumoraHsts({
        nodeEnv: "development",
        productionSimulation: null,
        enableHsts: null,
      })
    ).toBe(false);
  });

  it("enables HSTS in production", () => {
    expect(
      shouldApplyLumoraHsts({
        nodeEnv: "production",
      })
    ).toBe(true);
  });

  it("supports explicit production simulation", () => {
    expect(
      shouldApplyLumoraHsts({
        nodeEnv: "development",
        productionSimulation: "1",
        enableHsts: "1",
      })
    ).toBe(true);

    const headers = new Headers();

    applyLumoraSecurityHeaders(headers, { hsts: true });

    expect(headers.get("strict-transport-security")).toContain("max-age=");
  });
});
