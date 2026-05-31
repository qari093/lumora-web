import type { FinalSealCheck, LumaSpaceOmegaSeal } from "./types";

export function createLumaSpaceOmegaFinalSeal(checks: FinalSealCheck[]): LumaSpaceOmegaSeal {
  const passedChecks = checks.filter((check) => check.passed).length;
  const integrationPercent = checks.length === 0 ? 0 : Math.round((passedChecks / checks.length) * 100);

  return {
    system: "LumaSpace Ω∞",
    totalChecks: checks.length,
    passedChecks,
    integrationPercent,
    sealed: integrationPercent === 100,
  };
}
