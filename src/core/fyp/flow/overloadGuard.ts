import type { FeedSession } from "../core/types";

export function detectEmotionalOverload(session: FeedSession): boolean {
  return session.emotionalLoad >= 80 || session.continuityScore < 35;
}

export function recommendRecoveryCopy(session: FeedSession): string {
  if (!detectEmotionalOverload(session)) {
    return "Keep the atmosphere flowing.";
  }

  if (session.currentMode === "chaos" || session.currentMode === "energy") {
    return "The surge is cooling. Drift back when ready.";
  }

  return "The atmosphere is softening. We saved the thread.";
}
