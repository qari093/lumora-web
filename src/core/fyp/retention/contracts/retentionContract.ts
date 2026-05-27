import type {
  RetentionSignal,
  RetentionSignalType
} from "../types";

const SIGNALS: RetentionSignalType[] = [
  "watch",
  "return",
  "share",
  "favorite"
];

export function isRetentionSignalType(
  value: string
): value is RetentionSignalType {
  return SIGNALS.includes(
    value as RetentionSignalType
  );
}

export function validateRetentionSignal(
  signal: RetentionSignal
): boolean {
  return Boolean(
    signal.userId &&
    isRetentionSignalType(signal.type) &&
    Number.isFinite(signal.weight) &&
    Number.isFinite(signal.ts)
  );
}
