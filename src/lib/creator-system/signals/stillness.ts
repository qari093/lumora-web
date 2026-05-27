export function createStillnessSignal(userId: string) {
  return {
    type: "stillness",
    userId,
    createdAt: new Date().toISOString(),
  };
}
