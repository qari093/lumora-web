import type { FeedSession } from "../core/types";

export function createFeedSession(
  userId: string
): FeedSession {
  if (!userId.trim()) {
    throw new Error("Feed session requires userId.");
  }

  return {
    sessionId: `fyp_${userId}`,
    userId,
    currentMode: "drift",
    emotionalLoad: 0,
    continuityScore: 100
  };
}

export function updateEmotionalLoad(
  session: FeedSession,
  amount: number
): FeedSession {
  return {
    ...session,
    emotionalLoad: Math.max(
      0,
      session.emotionalLoad + amount
    )
  };
}
