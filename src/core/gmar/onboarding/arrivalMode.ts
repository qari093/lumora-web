export type ArrivalMode = "full_rite" | "fast_arrival";

export function normalizeArrivalMode(input?: string): ArrivalMode {
  return input === "fast_arrival" ? "fast_arrival" : "full_rite";
}

export function arrivalDurationSeconds(mode: ArrivalMode): number {
  return mode === "fast_arrival" ? 90 : 600;
}
