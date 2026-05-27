import type { FeedItem } from "../core/types";
import type {
  GutCheckClip,
  GutCheckSession
} from "./types";

export function createGutCheckSession(input: {
  userId: string;
  candidates: FeedItem[];
  now?: number;
}): GutCheckSession {
  if (!input.userId.trim()) {
    throw new Error("Gut Check requires userId.");
  }

  if (input.candidates.length < 4) {
    throw new Error("Gut Check requires at least 4 clips.");
  }

  const now = input.now ?? Date.now();

  const clips: GutCheckClip[] = input.candidates
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 4)
    .map(item => ({
      contentId: item.id,
      mode: item.mode,
      intensity: item.intensity,
      voltage:
        item.intensity * 10 +
        item.replayWeight * 2,
      durationSeconds: 15
    }));

  return {
    sessionId: `gutcheck_${input.userId}_${now}`,
    userId: input.userId,
    createdAt: now,
    expiresAt: now + 60000,
    clips,
    completed: false
  };
}
