export function createModerationReport(input: { reporterId: string; targetId: string; category: string }) {
  return {
    id: `report-${input.reporterId}-${input.targetId}-${Date.now()}`,
    ...input,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
}
