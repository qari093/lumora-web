export type ErrorLogRecord = {
  id: string;
  level: "error";
  message: string;
  source: string;
  captured: boolean;
};

export type ErrorLoggingVerificationInput = {
  records?: ErrorLogRecord[] | null;
};

export type ErrorLoggingVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        captured: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateErrorLoggingVerification(
  input: ErrorLoggingVerificationInput
): ErrorLoggingVerificationResult {
  const records = Array.isArray(input.records) ? input.records : [];
  if (records.length === 0) return { ok: false, reason: "missing_records" };

  const ids = new Set<string>();
  let captured = 0;

  for (const record of records) {
    if (!record.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(record.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(record.id);

    if (record.level !== "error") return { ok: false, reason: "invalid_level" };
    if (!record.message?.trim()) return { ok: false, reason: "missing_message" };
    if (!record.source?.trim()) return { ok: false, reason: "missing_source" };

    if (record.captured) captured += 1;
  }

  return {
    ok: true,
    verification: {
      total: records.length,
      captured,
      ready: captured === records.length,
    },
  };
}
