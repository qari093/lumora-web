export function createSilentOvationSignal(userId: string) {
  return {
    type: "silent-ovation",
    userId,
    createdAt: new Date().toISOString(),
  };
}
