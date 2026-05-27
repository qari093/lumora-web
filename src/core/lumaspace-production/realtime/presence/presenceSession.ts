import type { PresenceSession } from "../types";

export function createPresenceSession(userId: string): PresenceSession {
  return {
    id: `presence_${userId}`,
    userId,
    status: "ambient"
  };
}
