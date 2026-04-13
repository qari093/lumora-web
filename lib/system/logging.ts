export type LogLevel = "info" | "warn" | "error";

export type LogEventInput = {
  level?: LogLevel | null;
  message?: string | null;
  context?: Record<string, unknown> | null;
  ts?: number | null;
};

export type LogEvent =
  | {
      ok: true;
      event: {
        level: LogLevel;
        message: string;
        context: Record<string, unknown>;
        ts: number;
      };
    }
  | { ok: false; reason: string };

const MAX_MESSAGE_LENGTH = 500;

export function createLogEvent(input: LogEventInput): LogEvent {
  const level = input.level;
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const context = typeof input.context === "object" && input.context !== null ? input.context : {};
  const ts =
    typeof input.ts === "number" && Number.isFinite(input.ts) && input.ts > 0
      ? Math.trunc(input.ts)
      : Date.now();

  if (!level || !["info", "warn", "error"].includes(level)) {
    return { ok: false, reason: "invalid_level" };
  }

  if (!message) return { ok: false, reason: "missing_message" };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, reason: "message_too_long" };
  }

  return {
    ok: true,
    event: {
      level,
      message,
      context,
      ts,
    },
  };
}
