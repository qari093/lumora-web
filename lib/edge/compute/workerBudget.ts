export type EscalationDecision = Readonly<{
  // True means: do NOT run this on the Worker; delegate to origin / heavier compute path.
  escalate: boolean;
  // How many milliseconds of CPU budget remain for safe Worker execution.
  remainingMs: number;
  // Human readable reason for logs/metrics.
  reason: string;
}>;

export const DEFAULT_WORKER_CPU_BUDGET_MS = 50;

/**
 * Contract:
 * - Any path that expects > budget MUST escalate.
 * - If remaining budget is below 0, escalate.
 * - Budget is clamped to [0, 1000] to prevent misuse.
 */
export function shouldEscalateToOrigin(input: {
  expectedCpuMs: number;
  budgetMs?: number;
}): EscalationDecision {
  const budgetRaw = input.budgetMs ?? DEFAULT_WORKER_CPU_BUDGET_MS;
  const budgetMs = Number.isFinite(budgetRaw) ? Math.min(1000, Math.max(0, budgetRaw)) : DEFAULT_WORKER_CPU_BUDGET_MS;
  const expectedCpuMs = Number.isFinite(input.expectedCpuMs) ? input.expectedCpuMs : Number.POSITIVE_INFINITY;

  const remainingMs = budgetMs - expectedCpuMs;

  if (!Number.isFinite(expectedCpuMs) || expectedCpuMs < 0) {
    return { escalate: true, remainingMs: 0, reason: "invalid_expected_cpu" };
  }

  if (expectedCpuMs > budgetMs) {
    return { escalate: true, remainingMs: 0, reason: "cpu_over_budget" };
  }

  if (remainingMs < 0) {
    return { escalate: true, remainingMs: 0, reason: "negative_remaining" };
  }

  return { escalate: false, remainingMs, reason: "within_budget" };
}
