import type {
  RuntimeMatrixEntry
} from "../types";

export function validateRuntimeMatrixEntry(
  entry: RuntimeMatrixEntry
): boolean {
  return Boolean(
    Number.isInteger(entry.pack) &&
      entry.pack > 0 &&
      entry.name &&
      typeof entry.passed === "boolean" &&
      entry.marker
  );
}
