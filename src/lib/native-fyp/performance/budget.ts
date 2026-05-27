export const NATIVE_FYP_SWIPE_BUDGET_MS = 200;
export const NATIVE_FYP_FRAME_BUDGET_MS = 16.7;
export const NATIVE_FYP_MAX_DOM_VIDEO_CARDS = 3;

export function isSwipeWithinBudget(ms: number): boolean {
  return Number.isFinite(ms) && ms <= NATIVE_FYP_SWIPE_BUDGET_MS;
}

export function isFrameWithinBudget(ms: number): boolean {
  return Number.isFinite(ms) && ms <= NATIVE_FYP_FRAME_BUDGET_MS;
}
