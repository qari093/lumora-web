import type { AnchorCircle } from "./anchorCircle";

export const ANCHOR_CIRCLE_DURATION_MINUTES = 12;

export function enforceAnchorCircleDuration(circle: AnchorCircle): AnchorCircle {
  return {
    ...circle,
    durationMinutes: ANCHOR_CIRCLE_DURATION_MINUTES,
  };
}

export function getAnchorCircleEndTime(circle: AnchorCircle): string {
  const start = new Date(circle.launchTimeIso).getTime();
  return new Date(start + ANCHOR_CIRCLE_DURATION_MINUTES * 60_000).toISOString();
}
