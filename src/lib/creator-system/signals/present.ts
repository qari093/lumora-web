export function createPresentSignal(userId: string) {
  return {
    type: "present",
    userId,
    createdAt: new Date().toISOString(),
  };
}
