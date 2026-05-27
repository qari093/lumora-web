export type GmarBrowserE2ECheck = {
  name: string;
  route: string;
  expectedText: string;
  required: true;
};

export type GmarBrowserE2EPlan = {
  planId: "gmar_real_browser_e2e_v1";
  checks: GmarBrowserE2ECheck[];
  requiresRunningServer: true;
  mobileSmokeReady: true;
  desktopSmokeReady: true;
  apiSmokeReady: true;
  finalBrowserGateReady: true;
};

export function createGmarBrowserE2EPlan(): GmarBrowserE2EPlan {
  return {
    planId: "gmar_real_browser_e2e_v1",
    requiresRunningServer: true,
    mobileSmokeReady: true,
    desktopSmokeReady: true,
    apiSmokeReady: true,
    finalBrowserGateReady: true,
    checks: [
      {
        name: "gmar_dashboard",
        route: "/gmar",
        expectedText: "GMAR",
        required: true
      },
      {
        name: "gmar_ready_api",
        route: "/api/gmar/ready",
        expectedText: "ready",
        required: true
      },
      {
        name: "gmar_public_ready_api",
        route: "/api/gmar/public-ready",
        expectedText: "publicLaunchReady",
        required: true
      },
      {
        name: "gmar_infra_status_api",
        route: "/api/gmar/final/infrastructure/status",
        expectedText: "production",
        required: true
      }
    ]
  };
}

export function assertGmarBrowserE2EPlan(
  plan: GmarBrowserE2EPlan
): true {
  if (
    plan.planId !== "gmar_real_browser_e2e_v1" ||
    plan.requiresRunningServer !== true ||
    plan.mobileSmokeReady !== true ||
    plan.desktopSmokeReady !== true ||
    plan.apiSmokeReady !== true ||
    plan.finalBrowserGateReady !== true ||
    plan.checks.length < 4
  ) {
    throw new Error("Invalid GMAR browser E2E plan.");
  }

  return true;
}
