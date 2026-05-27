export type MemoryShelfEntry = {
  id: string;
  creatorId: string;
  videoId: string;
  circleId: string;
  timestampMs: number;
  phrase: string;
  createdAt: string;
  momentBased: true;
};

export function createMemoryShelfEntry(input: {
  id: string;
  creatorId: string;
  videoId: string;
  circleId: string;
  timestampMs: number;
  phrase: string;
  createdAt?: string;
}): MemoryShelfEntry {
  return {
    ...input,
    createdAt: input.createdAt || new Date().toISOString(),
    momentBased: true,
  };
}
