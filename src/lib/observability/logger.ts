export type LumoraLogLevel = "debug" | "info" | "warn" | "error";

export type LumoraLogEvent = {
  level: LumoraLogLevel;
  scope: string;
  message: string;
  requestId?: string;
  ts: number;
  meta?: Record<string, unknown>;
};

function emit(event: LumoraLogEvent) {
  const line = JSON.stringify(event);
  if (event.level === "error") {
    console.error(line);
    return;
  }
  if (event.level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export function logEvent(
  level: LumoraLogLevel,
  scope: string,
  message: string,
  meta?: Record<string, unknown>,
  requestId?: string
) {
  emit({
    level,
    scope,
    message,
    requestId,
    ts: Date.now(),
    meta,
  });
}

export const logger = {
  debug: (scope: string, message: string, meta?: Record<string, unknown>, requestId?: string) =>
    logEvent("debug", scope, message, meta, requestId),
  info: (scope: string, message: string, meta?: Record<string, unknown>, requestId?: string) =>
    logEvent("info", scope, message, meta, requestId),
  warn: (scope: string, message: string, meta?: Record<string, unknown>, requestId?: string) =>
    logEvent("warn", scope, message, meta, requestId),
  error: (scope: string, message: string, meta?: Record<string, unknown>, requestId?: string) =>
    logEvent("error", scope, message, meta, requestId),
};
