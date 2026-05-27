export function createFanCollection(input: { userId: string; title: string }) {
  return {
    id: `collection-${input.userId}-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString(),
  };
}
