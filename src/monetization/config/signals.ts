export type MonetizationSignal = {
  type: "present" | "hold" | "rewatch" | "skip";
  durationMs?: number;
};

export function isPositiveSignal(s: MonetizationSignal) {
  return s.type === "hold" || s.type === "rewatch";
}
