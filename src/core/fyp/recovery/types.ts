export type RecoverySeverity =
  | "soft"
  | "hard"
  | "fatal";

export interface RecoveryEvent {
  id: string;
  code: string;
  severity: RecoverySeverity;
  retryable: boolean;
}

export interface RecoveryDecision {
  id: string;
  action: "retry" | "fallback" | "halt";
  reason: string;
}
