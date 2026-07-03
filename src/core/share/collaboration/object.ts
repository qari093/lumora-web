import type { CollaborativeObject, CollaborativeObjectKind, CollaborationRole } from "./types";
import { permissionsForRole } from "./permissions";
import { createCollaborationVersion, restoreVersionSnapshot } from "./versioning";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "untitled";
}

export function createCollaborativeObject(params: {
  kind: CollaborativeObjectKind;
  title: string;
  ownerId: string;
  objectIds?: string[];
  portals?: string[];
}): CollaborativeObject {
  const objectIds = params.objectIds ?? [];

  return {
    id: `collab_${params.kind}_${params.ownerId}_${slug(params.title)}`,
    kind: params.kind,
    title: params.title,
    ownerId: params.ownerId,
    objectIds,
    version: 1,
    status: "active",
    portals: params.portals ?? ["lumaspace"],
    conflicts: [],
    presence: [],
    members: [
      {
        userId: params.ownerId,
        role: "owner",
        permissions: permissionsForRole("owner"),
        joinedAt: new Date().toISOString(),
        presence: "editing",
      },
    ],
    versions: [
      createCollaborationVersion({
        version: 1,
        actorId: params.ownerId,
        action: "created",
        snapshotObjectIds: objectIds,
      }),
    ],
  };
}

export function addCollaborationMember(
  object: CollaborativeObject,
  userId: string,
  role: CollaborationRole,
  actorId = object.ownerId,
): CollaborativeObject {
  const version = object.version + 1;
  const members = [
    ...object.members.filter((member) => member.userId !== userId),
    {
      userId,
      role,
      permissions: permissionsForRole(role),
      joinedAt: new Date().toISOString(),
      invitedBy: actorId,
      presence: "offline" as const,
    },
  ];

  return {
    ...object,
    version,
    members,
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "member_added",
        objectId: userId,
        snapshotObjectIds: object.objectIds,
      }),
    ],
  };
}

export function addSharedObject(object: CollaborativeObject, objectId: string, actorId: string): CollaborativeObject {
  const version = object.version + 1;
  const objectIds = Array.from(new Set([...object.objectIds, objectId]));

  return {
    ...object,
    version,
    objectIds,
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "object_added",
        objectId,
        snapshotObjectIds: objectIds,
      }),
    ],
  };
}

export function removeSharedObject(object: CollaborativeObject, objectId: string, actorId: string): CollaborativeObject {
  const version = object.version + 1;
  const objectIds = object.objectIds.filter((item) => item !== objectId);

  return {
    ...object,
    version,
    objectIds,
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "object_removed",
        objectId,
        snapshotObjectIds: objectIds,
      }),
    ],
  };
}

export function restoreCollaborativeObjectVersion(
  object: CollaborativeObject,
  targetVersion: number,
  actorId: string,
): CollaborativeObject {
  const target = object.versions.find((version) => version.version === targetVersion);
  if (!target) throw new Error(`collaboration_version_missing:${targetVersion}`);

  const version = object.version + 1;
  const objectIds = restoreVersionSnapshot(object.objectIds, target);

  return {
    ...object,
    version,
    objectIds,
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "restored",
        snapshotObjectIds: objectIds,
      }),
    ],
  };
}

export function publishCollaborativeObject(object: CollaborativeObject, actorId: string): CollaborativeObject {
  const version = object.version + 1;

  return {
    ...object,
    version,
    status: "published",
    versions: [
      ...object.versions,
      createCollaborationVersion({
        version,
        actorId,
        action: "published",
        snapshotObjectIds: object.objectIds,
      }),
    ],
  };
}
