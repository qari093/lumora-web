export function createModerationAppeal(input: { reportId: string; userId: string; reason: string }) {
  return {
    id: `appeal-${input.reportId}-${Date.now()}`,
    ...input,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
