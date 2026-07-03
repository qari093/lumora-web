import type { CollaborationVersion } from "./types";

export function createCollaborationVersion(params: {
  version: number;
  actorId: string;
  action: CollaborationVersion["action"];
  objectId?: string;
  snapshotObjectIds: string[];
}): CollaborationVersion {
  return {
    id: `collab_version_${params.version}_${params.action}_${params.actorId}`,
    version: params.version,
    actorId: params.actorId,
    action: params.action,
    objectId: params.objectId,
    snapshotObjectIds: [...params.snapshotObjectIds],
    at: new Date().toISOString(),
  };
}

export function restoreVersionSnapshot(currentObjectIds: string[], version: CollaborationVersion): string[] {
  return version.snapshotObjectIds.length > 0 ? [...version.snapshotObjectIds] : [...currentObjectIds];
}
