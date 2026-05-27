export function createRewatchSignal(userId: string) {
  return {
    type: "rewatch",
    userId,
    createdAt: new Date().toISOString(),
  };
}
