import { describe, expect, it } from "vitest";
import {
  addCohortTracking,
  buildAnalyticsDashboard,
  trackDeepEngagement,
  trackQuietResonance,
  validateAnalyticsAccuracy,
} from "@/src/lib/integration/analytics-layer";

describe("Pack21 Analytics Layer", () => {
  it("passes analytics flow", () => {
    const deep = trackDeepEngagement({ creatorId: "c1", witnessId: "w1", circleId: "circle1" });
    const quiet = trackQuietResonance({ creatorId: "c1", witnessId: "w2", memoryId: "m1" });
    const dashboard = buildAnalyticsDashboard([deep, quiet]);
    const cohort = addCohortTracking({ userId: "u1", cohort: "beta" });

    expect(deep.tracked).toBe(true);
    expect(quiet.event).toBe("quiet-resonance");
    expect(dashboard.totalEvents).toBe(2);
    expect(dashboard.deepEngagement).toBe(1);
    expect(dashboard.quietResonance).toBe(1);
    expect(cohort.cohortTracked).toBe(true);
    expect(validateAnalyticsAccuracy({ expected: 2, actual: dashboard.totalEvents }).ok).toBe(true);
    expect(validateAnalyticsAccuracy({ expected: 3, actual: dashboard.totalEvents }).ok).toBe(false);
  });
});
