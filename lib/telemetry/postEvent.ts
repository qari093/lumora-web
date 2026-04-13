import type { LumoraTelemetryEventType } from "./schema";

export async function postTelemetryEvent(input: {
  type: LumoraTelemetryEventType;
  sessionId?: string;
  userId?: string;
  mode?: "chill" | "focus" | "surge";
  portal?: string;
  targetId?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return res.ok;
  } catch {
    return false;
  }
}
