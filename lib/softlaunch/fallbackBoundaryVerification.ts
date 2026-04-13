export type FallbackBoundaryCase = {
  id: string;
  route: string;
  fallbackShown: boolean;
  recoveryAvailable: boolean;
  safeMessage: string;
};

export type FallbackBoundaryVerificationInput = {
  cases?: FallbackBoundaryCase[] | null;
};

export type FallbackBoundaryVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        safe: number;
        recoverable: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateFallbackBoundaryVerification(
  input: FallbackBoundaryVerificationInput
): FallbackBoundaryVerificationResult {
  const cases = Array.isArray(input.cases) ? input.cases : [];
  if (cases.length === 0) return { ok: false, reason: "missing_cases" };

  const ids = new Set<string>();
  let safe = 0;
  let recoverable = 0;

  for (const c of cases) {
    if (!c.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(c.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(c.id);

    if (!c.route?.trim()) return { ok: false, reason: "missing_route" };
    if (!c.route.startsWith("/")) return { ok: false, reason: "invalid_route" };
    if (!c.fallbackShown) return { ok: false, reason: "fallback_not_shown" };
    if (!c.safeMessage?.trim()) return { ok: false, reason: "missing_safe_message" };

    if (!/[a-zA-Z]/.test(c.safeMessage)) return { ok: false, reason: "invalid_safe_message" };

    safe += 1;
    if (c.recoveryAvailable) recoverable += 1;
  }

  return {
    ok: true,
    verification: {
      total: cases.length,
      safe,
      recoverable,
      ready: safe === cases.length && recoverable === cases.length,
    },
  };
}
