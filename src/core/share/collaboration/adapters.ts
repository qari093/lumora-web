import type { CollaborativeObject } from "./types";

export function collaborationPortalAdapter(object: CollaborativeObject, portal: string) {
  const labels: Record<string, string> = {
    fyp: "Collaborative FYP Story",
    lumaspace: "Shared LumaSpace Memory World",
    lumalink: "Relationship Collaboration Thread",
    live: "Live Co-Creation Room",
    zendoro: "Shared Gift Board",
    lumexa: "Shared Discovery Board",
    creator_hub: "Creator Collaboration Signal",
  };

  return {
    portal,
    label: labels[portal] ?? "Universal Collaboration",
    objectId: object.id,
    memberCount: object.members.length,
    objectCount: object.objectIds.length,
    version: object.version,
    status: object.status,
  };
}

export function createCrossPortalCollaborationManifest(object: CollaborativeObject) {
  return {
    id: `collab_manifest_${object.id}`,
    portals: object.portals,
    adapters: object.portals.map((portal) => collaborationPortalAdapter(object, portal)),
    identityPreserved: true,
  };
}
