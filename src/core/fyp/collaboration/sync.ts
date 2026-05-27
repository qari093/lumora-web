export type CollaborationSync = {
  forgeId: string;
  syncedCreators: number;
  synchronized: boolean;
};

export function createCollaborationSync(input: {
  forgeId: string;
  syncedCreators: number;
}): CollaborationSync {
  return {
    forgeId: input.forgeId,
    syncedCreators: input.syncedCreators,
    synchronized: input.syncedCreators >= 2
  };
}
