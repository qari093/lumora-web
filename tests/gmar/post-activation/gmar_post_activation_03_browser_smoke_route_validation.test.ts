import {
  createGmarRouteSmokePlan,
  assertGmarRouteSmokePlan
} from "@/src/core/gmar/smoke-active/routeSmoke";

describe("GMAR Post-Activation Pack 03 — Browser Smoke + Route Validation", () => {
  it("creates route smoke plan", () => {
    const plan = createGmarRouteSmokePlan();

    expect(plan.planId).toBe("gmar_route_smoke_v1");
    expect(plan.browserManualCheckRequired).toBe(true);
    expect(plan.apiReadinessCheckRequired).toBe(true);
    expect(plan.checks.map(check => check.route)).toContain("/gmar");
    expect(plan.checks.map(check => check.route)).toContain("/api/gmar/ready");
    expect(plan.checks.map(check => check.route)).toContain("/api/gmar/public-ready");
    expect(assertGmarRouteSmokePlan(plan)).toBe(true);
  });
});
