import type {
  PersonalizationSignal,
  PersonalizationSignalType
} from "../types";

const VALID_SIGNAL_TYPES: PersonalizationSignalType[] = [
  "watch",
  "like",
  "share",
  "skip",
  "dwell"
];

export function isPersonalizationSignalType(
  value: string
): value is PersonalizationSignalType {
  return VALID_SIGNAL_TYPES.includes(value as PersonalizationSignalType);
}

export function validatePersonalizationSignal(
  signal: PersonalizationSignal
): boolean {
  return Boolean(
    signal.userId &&
      signal.itemId &&
      isPersonalizationSignalType(signal.type) &&
      Number.isFinite(signal.weight) &&
      Number.isFinite(signal.ts) &&
      signal.ts > 0
  );
}
