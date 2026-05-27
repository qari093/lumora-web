export const ALLOWED_RUNTIME_SIGNALS = ["present", "hold", "rewatch"] as const;

export type RuntimeSignalType = (typeof ALLOWED_RUNTIME_SIGNALS)[number];

export function isRuntimeSignalType(value: unknown): value is RuntimeSignalType {
  return typeof value === "string" && ALLOWED_RUNTIME_SIGNALS.includes(value as RuntimeSignalType);
}

export function validateRuntimeSignalInput(input: unknown) {
  const body = input as { type?: unknown; videoId?: unknown; timestampMs?: unknown };

  const ok =
    isRuntimeSignalType(body?.type) &&
    typeof body?.videoId === "string" &&
    body.videoId.trim().length > 0 &&
    (typeof body?.timestampMs === "number" || typeof body?.timestampMs === "undefined");

  return {
    ok,
    type: ok ? body.type : null,
    videoId: ok ? body.videoId.trim() : null,
    timestampMs: ok ? body.timestampMs || 0 : 0,
    error: ok ? null : "invalid_runtime_signal",
  };
}
