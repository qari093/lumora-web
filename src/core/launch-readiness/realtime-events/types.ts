export type EventIntegrityStatus = "PASS" | "WARNING" | "FAILED";

export type RealtimeDomain =
  | "fyp"
  | "live"
  | "creator_alchemy"
  | "gmar"
  | "wallet"
  | "lumaspace"
  | "share"
  | "trust_safety"
  | "infra_telemetry";

export interface RealtimeEventContract {
  domain: RealtimeDomain;
  eventName: string;
  requiresIdempotencyKey: boolean;
  requiresTimestamp: boolean;
  requiresActorId: boolean;
  requiresReplaySafeId: boolean;
  requiresModerationGate: boolean;
  requiresTelemetry: boolean;
}

export interface RealtimeEventCapability {
  domain: RealtimeDomain;
  eventName: string;
  hasIdempotencyKey: boolean;
  hasTimestamp: boolean;
  hasActorId: boolean;
  hasReplaySafeId: boolean;
  hasModerationGate: boolean;
  hasTelemetry: boolean;
}

export interface RealtimeEventFinding {
  domain: RealtimeDomain;
  eventName: string;
  status: EventIntegrityStatus;
  missing: string[];
  message: string;
}

export interface RealtimeSynchronizationCheck {
  domain: RealtimeDomain;
  supportsEventReplay: boolean;
  supportsDeduplication: boolean;
  supportsBackpressure: boolean;
  supportsRecovery: boolean;
  status: EventIntegrityStatus;
}

export interface RealtimeEventIntegrityReport {
  generatedAt: string;
  status: EventIntegrityStatus;
  totalContracts: number;
  failedContracts: number;
  warningContracts: number;
  findings: RealtimeEventFinding[];
  synchronization: RealtimeSynchronizationCheck[];
}
