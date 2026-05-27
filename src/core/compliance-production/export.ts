export function createDataExportRequest(input: { userId: string }) {
  return {
    id: `export-${input.userId}-${Date.now()}`,
    userId: input.userId,
    status: "requested",
    requestedAt: new Date().toISOString(),
  };
}
