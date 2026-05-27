export type SafeCallable<Args extends unknown[] = unknown[], Result = unknown> = (
  ...args: Args
) => Result;

export type ErrorGuardResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function withErrorGuard<Args extends unknown[], Result>(
  fn: SafeCallable<Args, Result>,
  fallback?: Result
): SafeCallable<Args, ErrorGuardResult<Result>> {
  return (...args: Args): ErrorGuardResult<Result> => {
    try {
      return { ok: true, value: fn(...args) };
    } catch (error) {
      if (fallback !== undefined) {
        return { ok: true, value: fallback };
      }

      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown pipeline error",
      };
    }
  };
}

export function safeRun<Result>(
  fn: SafeCallable<[], Result>,
  fallback: Result
): Result {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
