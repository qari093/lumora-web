import type { CollaborationPermission, CollaborationRole } from "./types";

export function permissionsForRole(role: CollaborationRole, custom: CollaborationPermission[] = []): CollaborationPermission[] {
  if (role === "owner") {
    return ["read", "comment", "invite", "add_memory", "edit_memory", "remove_memory", "manage_roles", "resolve_conflicts", "restore_versions", "publish", "moderate"];
  }

  if (role === "co_owner") {
    return ["read", "comment", "invite", "add_memory", "edit_memory", "remove_memory", "manage_roles", "resolve_conflicts", "restore_versions", "publish"];
  }

  if (role === "editor") {
    return ["read", "comment", "add_memory", "edit_memory", "remove_memory", "resolve_conflicts", "publish"];
  }

  if (role === "contributor") {
    return ["read", "comment", "add_memory"];
  }

  if (role === "viewer") {
    return ["read", "comment"];
  }

  if (role === "custom") {
    return Array.from(new Set(["read", ...custom]));
  }

  return ["read"];
}

export function hasCollaborationPermission(
  role: CollaborationRole,
  permission: CollaborationPermission,
  custom: CollaborationPermission[] = [],
): boolean {
  return permissionsForRole(role, custom).includes(permission);
}
