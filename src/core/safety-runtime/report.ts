export function createContentReport(input: { reporterId: string; targetId: string; reason: string }) {
  return {
    ...input,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
}
