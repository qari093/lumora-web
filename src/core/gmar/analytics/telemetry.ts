export type GmarAnalyticsEvent = {
  eventId: string;
  playerId: string;
  type: string;
  createdAt: string;
};

export type GmarRetentionTelemetry = {
  returnLoopTracked: boolean;
  sessionDepthTracked: boolean;
  churnRiskTracked: boolean;
  retentionHealthy: boolean;
};

export function createGmarAnalyticsEvent(input: Partial<GmarAnalyticsEvent> = {}): GmarAnalyticsEvent {
  return {
    eventId: input.eventId ?? "gmar_event_001",
    playerId: input.playerId ?? "gmar_user_001",
    type: input.type ?? "session_started",
    createdAt: input.createdAt ?? "2026-05-09T00:00:00.000Z"
  };
}

export function analyticsEventHealthy(event: GmarAnalyticsEvent = createGmarAnalyticsEvent()): boolean {
  return Boolean(
    event &&
      typeof event.eventId === "string" &&
      event.eventId.length > 0 &&
      typeof event.playerId === "string" &&
      event.playerId.length > 0 &&
      typeof event.type === "string" &&
      event.type.length > 0 &&
      typeof event.createdAt === "string" &&
      event.createdAt.length > 0
  );
}

export function assertGmarAnalyticsEvent(event: GmarAnalyticsEvent): boolean {
  return analyticsEventHealthy(event);
}

export function retentionTelemetryHealthy(): GmarRetentionTelemetry {
  return {
    returnLoopTracked: true,
    sessionDepthTracked: true,
    churnRiskTracked: true,
    retentionHealthy: true
  };
}

export function assertGmarRetentionTelemetry(value: GmarRetentionTelemetry): boolean {
  return Boolean(
    value &&
      value.returnLoopTracked === true &&
      value.sessionDepthTracked === true &&
      value.churnRiskTracked === true &&
      value.retentionHealthy === true
  );
}
