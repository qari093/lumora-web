export type RuntimeValidationInput = {
  typescript: boolean;
  vitest: boolean;
  routes: boolean;
  hydration: boolean;
  middleware: boolean;
  runtimeMemorySafe: boolean;
  emotionalLoadSafe: boolean;
  privacySafe: boolean;
};

export type RuntimeValidationResult = {
  ok: boolean;
  score: number;
  seal: "unstable" | "stabilized";
};

export function createRuntimeValidationResult(
  input: RuntimeValidationInput
): RuntimeValidationResult {
  const values = Object.values(input);

  const passed = values.filter(Boolean).length;
  const score = Math.round((passed / values.length) * 100);

  return {
    ok: passed === values.length,
    score,
    seal: passed === values.length
      ? "stabilized"
      : "unstable"
  };
}

export function assertRuntimeValidationStable(
  result: RuntimeValidationResult
): boolean {
  return (
    result.ok &&
    result.score === 100 &&
    result.seal === "stabilized"
  );
}
