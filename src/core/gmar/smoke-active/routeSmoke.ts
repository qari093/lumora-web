export type GmarRouteSmokeCheck = {
  route: string;
  expectedStatus: 200;
  requiredText: string;
  required: true;
};

export type GmarRouteSmokePlan = {
  planId: "gmar_route_smoke_v1";
  checks: GmarRouteSmokeCheck[];
  browserManualCheckRequired: true;
  apiReadinessCheckRequired: true;
};

export function createGmarRouteSmokePlan(): GmarRouteSmokePlan {
  return {
    planId: "gmar_route_smoke_v1",
    browserManualCheckRequired: true,
    apiReadinessCheckRequired: true,
    checks: [
      {
        route: "/gmar",
        expectedStatus: 200,
        requiredText: "GMAR",
        required: true
      },
      {
        route: "/api/gmar/ready",
        expectedStatus: 200,
        requiredText: "gmar",
        required: true
      },
      {
        route: "/api/gmar/public-ready",
        expectedStatus: 200,
        requiredText: "publicLaunchReady",
        required: true
      }
    ]
  };
}

export function assertGmarRouteSmokePlan(plan: GmarRouteSmokePlan): true {
  if (
    plan.planId !== "gmar_route_smoke_v1" ||
    plan.browserManualCheckRequired !== true ||
    plan.apiReadinessCheckRequired !== true ||
    plan.checks.length < 3 ||
    plan.checks.some(check => check.expectedStatus !== 200 || check.required !== true)
  ) {
    throw new Error("Invalid GMAR route smoke plan.");
  }

  return true;
}
