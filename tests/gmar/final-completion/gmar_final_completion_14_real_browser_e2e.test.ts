import {
  createGmarBrowserE2EPlan,
  assertGmarBrowserE2EPlan
} from "@/src/core/gmar/final-completion/e2e/browserE2E";

describe("GMAR Final Completion Phase 14 — Real Browser E2E", () => {
  it("creates real browser E2E plan", () => {
    const plan = createGmarBrowserE2EPlan();

    expect(plan.planId).toBe("gmar_real_browser_e2e_v1");
    expect(plan.requiresRunningServer).toBe(true);
    expect(plan.mobileSmokeReady).toBe(true);
    expect(plan.desktopSmokeReady).toBe(true);
    expect(plan.apiSmokeReady).toBe(true);
    expect(plan.finalBrowserGateReady).toBe(true);
    expect(plan.checks.map(check => check.route)).toContain("/gmar");
    expect(plan.checks.map(check => check.route)).toContain("/api/gmar/ready");
    expect(plan.checks.map(check => check.route)).toContain("/api/gmar/public-ready");
    expect(plan.checks.map(check => check.route)).toContain("/api/gmar/final/infrastructure/status");
    expect(assertGmarBrowserE2EPlan(plan)).toBe(true);
  });
});
