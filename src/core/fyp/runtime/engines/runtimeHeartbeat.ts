export type RuntimeHeartbeat = {
  sessionId: string;
  stable: boolean;
  latencyMs: number;
  fallbackTriggered: boolean;
};

export function createRuntimeHeartbeat(input: {
  sessionId: string;
  latencyMs: number;
}): RuntimeHeartbeat {
  return {
    sessionId: input.sessionId,
    stable: input.latencyMs < 200,
    latencyMs: input.latencyMs,
    fallbackTriggered: input.latencyMs >= 400
  };
}
