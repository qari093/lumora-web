export type CollaborationRole =
  | "owner"
  | "co_owner"
  | "editor"
  | "contributor"
  | "viewer"
  | "guest"
  | "custom";

export type CollaborationPermission =
  | "read"
  | "comment"
  | "invite"
  | "add_memory"
  | "edit_memory"
  | "remove_memory"
  | "manage_roles"
  | "resolve_conflicts"
  | "restore_versions"
  | "publish"
  | "moderate";

export type CollaborativeObjectKind =
  | "shared_story"
  | "shared_garden"
  | "memory_constellation"
  | "journey_capsule"
  | "time_capsule"
  | "shared_collection"
  | "collaborative_playlist"
  | "shared_workspace"
  | "shared_mood_board";

export type CollaborationMember = {
  userId: string;
  role: CollaborationRole;
  permissions: CollaborationPermission[];
  joinedAt: string;
  invitedBy?: string;
  presence: "offline" | "viewing" | "editing" | "reacting";
};

export type CollaborationVersion = {
  id: string;
  version: number;
  actorId: string;
  action:
    | "created"
    | "member_added"
    | "member_removed"
    | "role_changed"
    | "object_added"
    | "object_removed"
    | "merged"
    | "restored"
    | "published";
  objectId?: string;
  snapshotObjectIds: string[];
  at: string;
};

export type CollaborationConflict = {
  id: string;
  objectId: string;
  actorA: string;
  actorB: string;
  reason: string;
  status: "pending" | "auto_merged" | "owner_review" | "resolved";
  resolution?: string;
};

export type CollaborationPresence = {
  userId: string;
  cursor?: { x: number; y: number };
  typing: boolean;
  reaction?: string;
  updatedAt: string;
};

export type CollaborativeObject = {
  id: string;
  kind: CollaborativeObjectKind;
  title: string;
  ownerId: string;
  members: CollaborationMember[];
  objectIds: string[];
  versions: CollaborationVersion[];
  conflicts: CollaborationConflict[];
  presence: CollaborationPresence[];
  version: number;
  status: "draft" | "active" | "published" | "archived";
  portals: string[];
};
