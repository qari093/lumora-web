import type { MonetizationSignal } from "../types";

export function validateMonetizationSignal(
  signal: MonetizationSignal
): boolean {
  return Boolean(
    signal.userId &&
      signal.itemId &&
      typeof signal.eligible === "boolean" &&
      typeof signal.value === "number" &&
      signal.value >= 0
  );
}
