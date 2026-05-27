import type { TrendSignal } from "../types";

export function validateTrendSignal(
  signal: TrendSignal
): boolean {
  return (
    typeof signal.id === "string" &&
    typeof signal.velocity === "number" &&
    typeof signal.engagement === "number"
  );
}
