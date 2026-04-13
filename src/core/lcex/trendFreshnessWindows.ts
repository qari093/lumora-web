export type TrendFreshnessWindow =
  | "breaking"
  | "day-1"
  | "week-1"
  | "month-1"
  | "long-tail";

export type TrendFreshnessWindowResult = {
  window: TrendFreshnessWindow;
  ageHours: number;
};

export function resolveTrendFreshnessWindow(
  detectedAt: string
): TrendFreshnessWindowResult {
  const parsed = Date.parse(detectedAt);
  const ageHours = Number.isNaN(parsed)
    ? 0
    : Math.max(0, (Date.now() - parsed) / (1000 * 60 * 60));

  if (ageHours <= 6) return { window: "breaking", ageHours: Number(ageHours.toFixed(2)) };
  if (ageHours <= 24) return { window: "day-1", ageHours: Number(ageHours.toFixed(2)) };
  if (ageHours <= 24 * 7) return { window: "week-1", ageHours: Number(ageHours.toFixed(2)) };
  if (ageHours <= 24 * 30) return { window: "month-1", ageHours: Number(ageHours.toFixed(2)) };
  return { window: "long-tail", ageHours: Number(ageHours.toFixed(2)) };
}

export function isTrendWithinHotWindow(
  detectedAt: string
): boolean {
  const result = resolveTrendFreshnessWindow(detectedAt);
  return result.window === "breaking" || result.window === "day-1" || result.window === "week-1";
}
