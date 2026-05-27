export function createHoldSignal(userId: string) {
  return {
    type: "hold",
    userId,
    createdAt: new Date().toISOString(),
  };
}
