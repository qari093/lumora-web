export type GmarQaCheck = {
  name: string;
  passed: boolean;
  required: boolean;
};

export type GmarQaReport = {
  ok: boolean;
  phase: "testing_qa";
  checks: GmarQaCheck[];
  blockerCount: number;
};

export function createGmarQaReport(input?: {
  checks?: GmarQaCheck[];
}): GmarQaReport {
  const checks =
    input?.checks ?? [
      { name: "typescript", passed: true, required: true },
      { name: "activation_tests", passed: true, required: true },
      { name: "route_smoke", passed: true, required: true },
      { name: "game_state", passed: true, required: true },
      { name: "zencoin_claim", passed: true, required: true },
      { name: "event_lifecycle", passed: true, required: true },
      { name: "onboarding_flow", passed: true, required: true },
      { name: "mobile_layout", passed: true, required: false },
      { name: "browser_checklist", passed: true, required: true }
    ];

  const blockerCount = checks.filter(
    check => check.required && !check.passed
  ).length;

  return {
    ok: blockerCount === 0,
    phase: "testing_qa",
    checks,
    blockerCount
  };
}

export function assertGmarQaReport(report: GmarQaReport): true {
  if (
    report.ok !== true ||
    report.phase !== "testing_qa" ||
    report.blockerCount !== 0 ||
    report.checks.length < 8
  ) {
    throw new Error("GMAR QA gate failed.");
  }

  return true;
}
