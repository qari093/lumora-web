import type { StreamSession } from "../types";

export function createStreamSession(): StreamSession {
  return {
    id: "stream_001",
    bitrate: 3200,
    active: true
  };
}
