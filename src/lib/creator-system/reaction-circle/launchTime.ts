export const DEFAULT_ANCHOR_CIRCLE_HOUR_UTC = 19;
export const DEFAULT_ANCHOR_CIRCLE_MINUTE_UTC = 0;

export function buildDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildFixedAnchorLaunchTime(date: Date): string {
  const launch = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    DEFAULT_ANCHOR_CIRCLE_HOUR_UTC,
    DEFAULT_ANCHOR_CIRCLE_MINUTE_UTC,
    0,
    0,
  ));

  return launch.toISOString();
}
