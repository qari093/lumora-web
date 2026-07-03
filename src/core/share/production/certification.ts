import type { ProductionCertification, ProductionCheck } from "./types";
import { summarizeProductionChecks } from "./checks";

export function createProductionCertification(version: string, checks: ProductionCheck[]): ProductionCertification {
  const summary = summarizeProductionChecks(checks);

  return {
    id: `usl_production_certification_${version}`,
    system: "universal_share_layer",
    version,
    checks,
    score: summary.score,
    state: summary.state,
    lockedAt: new Date().toISOString(),
  };
}

export function validateProductionCertification(certification: ProductionCertification): boolean {
  return certification.system === "universal_share_layer" && certification.state === "pass" && certification.score >= 0.9;
}
