import type {
  RuntimeMode,
  RuntimeSession
} from "./types";

export function createRuntimeSession(input: {
  userId: string;
  mode: RuntimeMode;
}): RuntimeSession {
  return {
    sessionId: `runtime_${input.userId}_${input.mode}`,
    userId: input.userId,
    mode: input.mode,
    active: true,
    emotionalLoad: 0,
    queueDepth: 0
  };
}
