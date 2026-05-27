import { describe, expect, it } from "vitest";
import { liveOpsCmsHealthy } from "../../../src/core/gmar/liveops-cms/runtime";

describe("GMAR Pack 28 — LiveOps + Seasonal CMS", () => {
  it("validates LiveOps CMS", () => {
    const cms = liveOpsCmsHealthy();

    expect(cms.seasonalContent).toBe(true);
    expect(cms.eventScheduling).toBe(true);
    expect(cms.rollbackReady).toBe(true);
  });
});
