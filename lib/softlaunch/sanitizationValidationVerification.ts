export type SanitizationSample = {
  id: string;
  field: string;
  input: string;
  sanitized: string;
  valid: boolean;
};

export type SanitizationValidationVerificationInput = {
  samples?: SanitizationSample[] | null;
};

export type SanitizationValidationVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        valid: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateSanitizationValidationVerification(
  input: SanitizationValidationVerificationInput
): SanitizationValidationVerificationResult {
  const samples = Array.isArray(input.samples) ? input.samples : [];
  if (samples.length === 0) return { ok: false, reason: "missing_samples" };

  const ids = new Set<string>();
  let validCount = 0;

  for (const sample of samples) {
    if (!sample.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(sample.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(sample.id);

    if (!sample.field?.trim()) return { ok: false, reason: "missing_field" };
    if (typeof sample.input !== "string") return { ok: false, reason: "invalid_input" };
    if (typeof sample.sanitized !== "string") return { ok: false, reason: "invalid_sanitized" };

    if (sample.sanitized.includes("<") || sample.sanitized.includes(">")) {
      return { ok: false, reason: "unsanitized_markup" };
    }

    if (sample.valid) validCount += 1;
  }

  return {
    ok: true,
    verification: {
      total: samples.length,
      valid: validCount,
      ready: validCount === samples.length,
    },
  };
}
