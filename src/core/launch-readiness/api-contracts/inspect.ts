import type {
  ApiContractInspection,
  ContractSeverity,
  ContractStatus
} from "./types";

import type { ApiRouteFixture } from "./fixtures";

function severityFromMissing(
  missing: string[]
): ContractSeverity {
  if (
    missing.includes("request_id") ||
    missing.includes("stable_envelope")
  ) {
    return "critical";
  }

  if (
    missing.includes("safe_errors") ||
    missing.includes("versioning")
  ) {
    return "high";
  }

  if (missing.length > 0) {
    return "medium";
  }

  return "low";
}

function statusFromSeverity(
  severity: ContractSeverity
): ContractStatus {
  if (severity === "critical" || severity === "high") {
    return "FAILED";
  }

  if (severity === "medium") {
    return "WARNING";
  }

  return "PASS";
}

export function inspectApiContract(
  fixture: ApiRouteFixture
): ApiContractInspection {
  const code = fixture.implementation;

  const hasRequestId =
    code.includes("requestId");

  const hasStableEnvelope =
    code.includes("ok:");

  const hasSafeErrors =
    !code.includes("stack") &&
    !code.includes("internal_error_dump");

  const hasVersioning =
    code.includes("version:");

  const hasTypedMeta =
    code.includes("meta:");

  const missing: string[] = [];

  if (!hasRequestId) {
    missing.push("request_id");
  }

  if (!hasStableEnvelope) {
    missing.push("stable_envelope");
  }

  if (!hasSafeErrors) {
    missing.push("safe_errors");
  }

  if (!hasVersioning) {
    missing.push("versioning");
  }

  if (!hasTypedMeta) {
    missing.push("typed_meta");
  }

  const severity =
    severityFromMissing(missing);

  return {
    route: fixture.route,
    domain: fixture.domain,
    hasRequestId,
    hasStableEnvelope,
    hasSafeErrors,
    hasVersioning,
    hasTypedMeta,
    severity,
    status: statusFromSeverity(severity),
    missing
  };
}
