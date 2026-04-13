export type BuildRegressionSignal = {
  name: string;
  passed: boolean;
};

export type BuildRegressionSweepInput = {
  signals?: BuildRegressionSignal[] | null;
};

export type BuildRegressionSweepResult =
  | {
      ok: true;
      sweep: {
        total: number;
        passed: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateBuildRegressionSweep(
  input: BuildRegressionSweepInput
): BuildRegressionSweepResult {
  const signals = Array.isArray(input.signals) ? input.signals : [];
  if (signals.length === 0) return { ok: false, reason: "missing_signals" };

  const names = new Set<string>();
  let passed = 0;

  for (const signal of signals) {
    if (!signal.name?.trim()) return { ok: false, reason: "missing_name" };
    if (names.has(signal.name)) return { ok: false, reason: "duplicate_name" };
    names.add(signal.name);
    if (signal.passed) passed += 1;
  }

  return {
    ok: true,
    sweep: {
      total: signals.length,
      passed,
      ready: passed === signals.length,
    },
  };
}
