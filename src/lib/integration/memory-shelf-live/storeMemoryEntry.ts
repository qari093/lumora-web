export type LiveMemoryEntry = {
  id: string;
  creatorId: string;
  circleId: string;
  videoId: string;
  timestampMs: number;
  phrase: string;
  createdAt: string;
  stored: true;
};

export function storeMemoryEntryAfterCircle(input: {
  id: string;
  creatorId: string;
  circleId: string;
  videoId: string;
  timestampMs: number;
  phrase: string;
  createdAt?: string;
}): LiveMemoryEntry {
  return {
    id: input.id,
    creatorId: input.creatorId,
    circleId: input.circleId,
    videoId: input.videoId,
    timestampMs: input.timestampMs,
    phrase: input.phrase,
    createdAt: input.createdAt || new Date().toISOString(),
    stored: true,
  };
}
