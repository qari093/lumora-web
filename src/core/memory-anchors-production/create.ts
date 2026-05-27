export function createProductionMemoryAnchor(input: {
  creatorId: string;
  postId: string;
  timestampMs: number;
  label?: string;
}) {
  return {
    id: `anchor-${input.creatorId}-${input.postId}-${input.timestampMs}`,
    ...input,
    createdAt: new Date().toISOString(),
  };
}
