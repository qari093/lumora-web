export const NATIVE_FYP_MIN_DURATION_SECONDS = 3;
export const NATIVE_FYP_MAX_DURATION_SECONDS = 120;

export function validateNativeFypDuration(seconds: number): {
  ok: boolean;
  reason?: string;
} {
  if (!Number.isFinite(seconds)) return { ok: false, reason: "duration_not_finite" };
  if (seconds < NATIVE_FYP_MIN_DURATION_SECONDS) return { ok: false, reason: "duration_too_short" };
  if (seconds > NATIVE_FYP_MAX_DURATION_SECONDS) return { ok: false, reason: "duration_too_long" };
  return { ok: true };
}
