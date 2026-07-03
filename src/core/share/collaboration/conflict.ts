import type { CollaborationConflict, CollaborativeObject } from "./types";
import { createCollaborationVersion } from "./versioning";

export function detectCollaborationConflict(params: {
  objectId: string;
  actorA: string;
  actorB: string;
  previousHash: string;
  nextHash: string;
}): CollaborationConflict | null {
  if (params.previousHash === params.nextHash || params.actorA === params.actorB) return null;

  return {
    id: `collab_conflict_${params.objectId}_${params.actorA}_${params.actorB}`,
    objectId: params.objectId,
    actorA: params.actorA,
    actorB: params.actorB,
    reason: "Concurrent edits touched the same shared object.",
    status: "pending",
  };
}

export function attachCollaborationConflict(
  object: CollaborativeObject,
  conflict: CollaborationConflict | null,
): CollaborativeObject {
  if (!conflict) return object;

  return {
    ...object,
    conflicts: [...object.conflicts.filter((item) => item.id !== conflict.id), conflict],
  };
}

export function resolveCollaborationConflict(
  object: CollaborativeObject,
  conflictId: string,
  actorId: string,
  resolution: "auto_merged" | "owner_review" | "resolved",
): CollaborativeObject {
  const version = object.version + 1;

  return {
    ...object,
    version,
    conflicts: object.conflicts.map((conflict) =>
      conflict.id === conflictId
        ? { ...conflict, status: resolution, resolution: `${resolution}_by_${actorId}` }
        : conflict,
    ),
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "merged",
        objectId: conflictId,
        snapshotObjectIds: object.objectIds,
      }),
    ],
  };
}
