import type { GravityDirection, GravitySample } from "./types";

export function getScrollDirection(previous: GravitySample | undefined, current: GravitySample): GravityDirection {
  if (!previous) return "none";
  if (current.scrollY > previous.scrollY) return "down";
  if (current.scrollY < previous.scrollY) return "up";
  return "none";
}

export function getScrollVelocity(previous: GravitySample | undefined, current: GravitySample): number {
  if (!previous) return 0;
  const deltaY = Math.abs(current.scrollY - previous.scrollY);
  const deltaT = Math.max(16, current.timestamp - previous.timestamp);
  return deltaY / deltaT;
}

export function getBottomProximity(current: GravitySample): number {
  const remaining = Math.max(0, current.documentHeight - (current.scrollY + current.viewportHeight));
  return remaining;
}

export function getTopProximity(current: GravitySample): number {
  return Math.max(0, current.scrollY);
}

export function normalizeProximity(distancePx: number, thresholdPx: number): number {
  if (thresholdPx <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - distancePx / thresholdPx));
}
