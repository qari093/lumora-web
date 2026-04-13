import { createRequestId } from "@/lib/observability/requestId";

export type LumoraTrace = {
  requestId: string;
  startedAt: number;
  scope: string;
};

export function startTrace(scope: string, requestId?: string): LumoraTrace {
  return {
    requestId: requestId || createRequestId(),
    startedAt: Date.now(),
    scope,
  };
}

export function finishTrace(trace: LumoraTrace) {
  return {
    requestId: trace.requestId,
    scope: trace.scope,
    startedAt: trace.startedAt,
    finishedAt: Date.now(),
    durationMs: Date.now() - trace.startedAt,
  };
}
