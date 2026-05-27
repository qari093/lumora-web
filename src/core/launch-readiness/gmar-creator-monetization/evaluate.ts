import type { GcmCapability, GcmFinding, GcmStatus, GcmSystem } from "./types";
import { GCM_CAPABILITIES } from "./capabilities";

export function statusForCapability(capability: GcmCapability): GcmStatus {
  if (capability.ready) return "PASS";
  if (capability.severity === "critical" || capability.severity === "high") return "FAILED";
  return "WARNING";
}

export function evaluateGcmCapability(capability: GcmCapability): GcmFinding {
  const status = statusForCapability(capability);

  return {
    system: capability.system,
    capability: capability.capability,
    status,
    severity: capability.severity,
    message: capability.ready
      ? `${capability.capability} satisfies launch readiness.`
      : capability.message,
    ...(status !== "PASS"
      ? { requiredFix: "Complete this capability or keep the related feature behind launch-safe activation gates." }
      : {})
  };
}

export function statusForSystem(findings: GcmFinding[], system: GcmSystem): GcmStatus {
  const scoped = findings.filter((finding) => finding.system === system);
  if (scoped.some((finding) => finding.status === "FAILED")) return "FAILED";
  if (scoped.some((finding) => finding.status === "WARNING")) return "WARNING";
  return "PASS";
}

export function evaluateGcmCapabilities(capabilities: GcmCapability[] = GCM_CAPABILITIES): GcmFinding[] {
  return capabilities.map(evaluateGcmCapability);
}
