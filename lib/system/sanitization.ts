export type SanitizationInput = {
  text?: string | null;
  maxLength?: number | null;
  allowNewlines?: boolean | null;
};

export type SanitizationResult =
  | {
      ok: true;
      value: string;
    }
  | { ok: false; reason: string };

export function sanitizeText(input: SanitizationInput): SanitizationResult {
  const raw = typeof input.text === "string" ? input.text : "";
  const maxLength =
    typeof input.maxLength === "number" && Number.isFinite(input.maxLength)
      ? Math.trunc(input.maxLength)
      : NaN;
  const allowNewlines = Boolean(input.allowNewlines);

  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return { ok: false, reason: "invalid_max_length" };
  }

  let value = raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .replace(/\u0000/g, "");

  value = allowNewlines
    ? value.replace(/[ \t]+/g, " ").trim()
    : value.replace(/\s+/g, " ").trim();

  if (!value) return { ok: false, reason: "empty_value" };
  if (value.length > maxLength) {
    return { ok: false, reason: "value_too_long" };
  }

  return { ok: true, value };
}
