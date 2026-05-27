import type {
  EventIntegrityStatus,
  RealtimeEventContract,
  RealtimeEventFinding,
  RealtimeSynchronizationCheck
} from "./types";
import { getRealtimeCapability } from "./capabilities";

function statusFromMissing(missing: string[]): EventIntegrityStatus {
  if (missing.includes("idempotencyKey") || missing.includes("replaySafeId") || missing.includes("actorId")) {
    return "FAILED";
  }

  if (missing.length > 0) {
    return "WARNING";
  }

  return "PASS";
}

export function evaluateRealtimeEventContract(contract: RealtimeEventContract): RealtimeEventFinding {
  const capability = getRealtimeCapability(contract.domain, contract.eventName);

  if (!capability) {
    return {
      domain: contract.domain,
      eventName: contract.eventName,
      status: "FAILED",
      missing: ["capability"],
      message: "No realtime capability exists for this event contract."
    };
  }

  const missing: string[] = [];

  if (contract.requiresIdempotencyKey && !capability.hasIdempotencyKey) missing.push("idempotencyKey");
  if (contract.requiresTimestamp && !capability.hasTimestamp) missing.push("timestamp");
  if (contract.requiresActorId && !capability.hasActorId) missing.push("actorId");
  if (contract.requiresReplaySafeId && !capability.hasReplaySafeId) missing.push("replaySafeId");
  if (contract.requiresModerationGate && !capability.hasModerationGate) missing.push("moderationGate");
  if (contract.requiresTelemetry && !capability.hasTelemetry) missing.push("telemetry");

  const status = statusFromMissing(missing);

  return {
    domain: contract.domain,
    eventName: contract.eventName,
    status,
    missing,
    message: missing.length === 0
      ? "Realtime event contract satisfies launch integrity requirements."
      : `Realtime event contract missing: ${missing.join(", ")}.`
  };
}

export function buildRealtimeSynchronizationChecks(): RealtimeSynchronizationCheck[] {
  const checks: RealtimeSynchronizationCheck[] = [
    {
      domain: "fyp",
      supportsEventReplay: true,
      supportsDeduplication: true,
      supportsBackpressure: true,
      supportsRecovery: true,
      status: "PASS"
    },
    {
      domain: "live",
      supportsEventReplay: true,
      supportsDeduplication: true,
      supportsBackpressure: true,
      supportsRecovery: true,
      status: "PASS"
    },
    {
      domain: "creator_alchemy",
      supportsEventReplay: true,
      supportsDeduplication: true,
      supportsBackpressure: true,
      supportsRecovery: true,
      status: "PASS"
    },
    {
      domain: "gmar",
      supportsEventReplay: true,
      supportsDeduplication: true,
      supportsBackpressure: false,
      supportsRecovery: true,
      status: "WARNING"
    },
    {
      domain: "wallet",
      supportsEventReplay: true,
      supportsDeduplication: true,
      supportsBackpressure: true,
      supportsRecovery: true,
      status: "PASS"
    }
  ];

  return checks;
}
