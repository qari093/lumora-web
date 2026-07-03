import type { ProductionCheck, ProductionReadinessState } from "./types";

function stateFromScore(score: number): ProductionReadinessState {
  if (score >= 0.9) return "pass";
  if (score >= 0.72) return "warn";
  return "fail";
}

export function createProductionCheck(id: string, label: string, score: number, detail: string): ProductionCheck {
  return {
    id,
    label,
    score: Number(Math.max(0, Math.min(1, score)).toFixed(4)),
    state: stateFromScore(score),
    detail,
  };
}

export function summarizeProductionChecks(checks: ProductionCheck[]) {
  const score = Number((checks.reduce((sum, check) => sum + check.score, 0) / Math.max(1, checks.length)).toFixed(4));
  const state: ProductionReadinessState = checks.some((check) => check.state === "fail")
    ? "fail"
    : checks.some((check) => check.state === "warn")
      ? "warn"
      : "pass";

  return { score, state };
}
