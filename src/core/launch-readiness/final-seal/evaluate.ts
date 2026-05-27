import { existsSync } from "node:fs";
import type { FinalSealFinding, InfrastructureCapability } from "./types";

export function evaluateRequiredLocks(requiredLocks: string[]): {
  missingLocks: string[];
  findings: FinalSealFinding[];
} {
  const missingLocks = requiredLocks.filter((lock) => !existsSync(lock));

  return {
    missingLocks,
    findings: missingLocks.map((lock) => ({
      area: "phase_lock",
      status: "FAILED",
      severity: "critical",
      message: `Missing required launch readiness lock: ${lock}`,
      requiredFix: "Complete and validate the missing phase before sealing launch readiness."
    }))
  };
}

export function evaluateInfrastructureCapability(capability: InfrastructureCapability): FinalSealFinding {
  if (capability.ready) {
    return {
      area: capability.name,
      status: "PASS",
      severity: capability.severity,
      message: `${capability.name} satisfies final launch readiness.`
    };
  }

  return {
    area: capability.name,
    status: capability.severity === "critical" || capability.severity === "high" ? "FAILED" : "WARNING",
    severity: capability.severity,
    message: capability.message,
    requiredFix: "Keep this capability private-beta gated until real operational validation passes."
  };
}

export function evaluateInfrastructure(capabilities: InfrastructureCapability[]): FinalSealFinding[] {
  return capabilities.map(evaluateInfrastructureCapability);
}
