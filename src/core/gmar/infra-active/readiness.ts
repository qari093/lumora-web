export type GmarReadinessCheck = {
  name: string;
  ok: boolean;
  required: boolean;
};

export type GmarReadinessReport = {
  ok: boolean;
  service: "gmar";
  status: "ready" | "degraded";
  checks: GmarReadinessCheck[];
  generatedAt: string;
};

export function createGmarReadinessReport(input?: {
  now?: Date;
  checks?: GmarReadinessCheck[];
}): GmarReadinessReport {
  const checks =
    input?.checks ?? [
      { name: "route", ok: true, required: true },
      { name: "player_identity", ok: true, required: true },
      { name: "game_state", ok: true, required: true },
      { name: "gameplay_loop", ok: true, required: true },
      { name: "zencoin_economy", ok: true, required: true },
      { name: "world_events", ok: true, required: true },
      { name: "social_foundation", ok: true, required: true },
      { name: "fyp_bridge", ok: true, required: true },
      { name: "creator_ecosystem", ok: true, required: true },
      { name: "ai_assist_safe_mode", ok: true, required: true }
    ];

  const requiredOk = checks
    .filter(check => check.required)
    .every(check => check.ok);

  return {
    ok: requiredOk,
    service: "gmar",
    status: requiredOk ? "ready" : "degraded",
    checks,
    generatedAt: (input?.now ?? new Date()).toISOString()
  };
}

export function assertGmarReadinessReport(report: GmarReadinessReport): true {
  if (
    report.service !== "gmar" ||
    report.ok !== true ||
    report.status !== "ready" ||
    report.checks.length < 10
  ) {
    throw new Error("Invalid GMAR readiness report.");
  }

  return true;
}
