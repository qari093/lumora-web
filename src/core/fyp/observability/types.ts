export type ObservabilityLevel =
  | "info"
  | "warn"
  | "error";

export interface ObservabilityEvent {
  id: string;
  level: ObservabilityLevel;
  message: string;
  ts: number;
}

export interface ObservabilitySnapshot {
  ok: true;
  total: number;
  errors: number;
  warnings: number;
}
