import { describe, expect, it } from "vitest";
import {
  fypActivationItems,
  getFypActivationSummary
} from "../../src/core/founder-activation/fypActivation";

describe("FYP founder activation", () => {
  it("provides real founder-review cards", () => {
    expect(fypActivationItems.length).toBeGreaterThanOrEqual(5);
    expect(fypActivationItems.some((item) => item.portal === "FYP")).toBe(true);
    expect(fypActivationItems.some((item) => item.portal === "Live")).toBe(true);
    expect(fypActivationItems.some((item) => item.portal === "GMAR")).toBe(true);
    expect(fypActivationItems.some((item) => item.portal === "Zendoro")).toBe(true);
    expect(fypActivationItems.some((item) => item.portal === "NEXA")).toBe(true);
  });

  it("keeps activation in safe founder-review mode", () => {
    const summary = getFypActivationSummary();

    expect(summary.status).toBe("FYP_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.portalBridges).toBeGreaterThanOrEqual(5);
  });
});
