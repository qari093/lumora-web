export function createCollaborationLedgerEntry(input: { creatorA: string; creatorB: string; status: string }) {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}
