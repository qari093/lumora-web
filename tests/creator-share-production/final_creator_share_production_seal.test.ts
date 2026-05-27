import { describe, expect, it } from "vitest";
import { creatorShareProductionSeal } from "../../src/core/final-seals/creator-share-production-seal";
import { postLaunchMonitoringChecklist } from "../../src/core/post-launch/monitoring";

describe("Creator + Share OS Final Production Seal", () => {
  it("seals the production wave", () => {
    expect(creatorShareProductionSeal.sealed).toBe(true);
    expect(creatorShareProductionSeal.productionPacksComplete).toBe(true);
    expect(creatorShareProductionSeal.postLaunchHardeningReady).toBe(true);
  });

  it("covers post-launch monitoring domains", () => {
    expect(postLaunchMonitoringChecklist.errors).toBe(true);
    expect(postLaunchMonitoringChecklist.paymentFailures).toBe(true);
    expect(postLaunchMonitoringChecklist.shareLinkConversion).toBe(true);
  });
});
