export type SwipeSpeed = "slow" | "normal" | "rapid";

export function classifySwipeSpeed(swipes: number, windowMs: number): SwipeSpeed {
  if (windowMs <= 0) return "normal";
  const perSecond = swipes / (windowMs / 1000);

  if (perSecond >= 3) return "rapid";
  if (perSecond <= 0.75) return "slow";
  return "normal";
}

export function shouldPreloadForSwipeSpeed(speed: SwipeSpeed): boolean {
  return speed !== "rapid";
}
