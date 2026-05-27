export function createDeleteAccountRequest(input: { userId: string }) {
  return {
    id: `delete-${input.userId}-${Date.now()}`,
    userId: input.userId,
    status: "requested",
    requestedAt: new Date().toISOString(),
  };
}
