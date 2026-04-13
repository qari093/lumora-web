export type SessionEventType =
  | "session_start"
  | "page_view"
  | "video_view"
  | "interaction"
  | "session_end";

export type SessionEvent = {
  sessionId: string;
  userId?: string;
  type: SessionEventType;
  timestamp: number;
  path?: string;
  durationMs?: number;
};

export type SessionSummary = {
  sessionId: string;
  userId: string | null;
  startedAt: number | null;
  endedAt: number | null;
  durationMs: number;
  pageViews: number;
  videoViews: number;
  interactions: number;
  totalEvents: number;
  valid: boolean;
};

export function validateSessionEvent(event: SessionEvent): boolean {
  if (!event.sessionId || typeof event.sessionId !== "string") return false;
  if (!Number.isFinite(event.timestamp) || event.timestamp <= 0) return false;

  if (event.durationMs != null) {
    if (!Number.isFinite(event.durationMs) || event.durationMs < 0) return false;
  }

  return true;
}

export function summarizeSession(events: SessionEvent[], sessionId: string): SessionSummary {
  const filtered = events
    .filter((e) => e.sessionId === sessionId)
    .filter(validateSessionEvent)
    .sort((a, b) => a.timestamp - b.timestamp);

  const startedAt = filtered.find((e) => e.type === "session_start")?.timestamp ?? null;
  const endedAt = [...filtered].reverse().find((e) => e.type === "session_end")?.timestamp ?? null;
  const firstTs = filtered[0]?.timestamp ?? null;
  const lastTs = filtered[filtered.length - 1]?.timestamp ?? null;

  const effectiveStart = startedAt ?? firstTs;
  const effectiveEnd = endedAt ?? lastTs;

  const durationMs =
    effectiveStart != null && effectiveEnd != null && effectiveEnd >= effectiveStart
      ? effectiveEnd - effectiveStart
      : 0;

  return {
    sessionId,
    userId: filtered.find((e) => e.userId)?.userId ?? null,
    startedAt,
    endedAt,
    durationMs,
    pageViews: filtered.filter((e) => e.type === "page_view").length,
    videoViews: filtered.filter((e) => e.type === "video_view").length,
    interactions: filtered.filter((e) => e.type === "interaction").length,
    totalEvents: filtered.length,
    valid: filtered.length > 0
  };
}
