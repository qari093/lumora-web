import { describe, expect, it } from "vitest";
import {
  addCollaborationMember,
  addSharedObject,
  attachCollaborationConflict,
  collaborationPortalAdapter,
  createCollaborationVersion,
  createCollaborativeObject,
  createContributionSummary,
  createCrossPortalCollaborationManifest,
  detectCollaborationConflict,
  hasCollaborationPermission,
  permissionsForRole,
  publishCollaborativeObject,
  removeSharedObject,
  resolveCollaborationConflict,
  restoreCollaborativeObjectVersion,
  summarizeCollaborationHealth,
  summarizeLiveCollaboration,
  suggestCollaborators,
  updateCollaborationPresence,
} from "@/src/core/share";

describe("USL Mega Pack 06 — Collaboration Civilization Ω", () => {
  it("creates collaborative objects with roles and permissions", () => {
    const object = createCollaborativeObject({
      kind: "shared_garden",
      title: "Wonder Garden",
      ownerId: "waqar",
      objectIds: ["memory_1"],
      portals: ["lumaspace", "lumalink"],
    });

    const withMember = addCollaborationMember(object, "ayesha", "editor");

    expect(object.members[0].role).toBe("owner");
    expect(permissionsForRole("owner")).toContain("manage_roles");
    expect(hasCollaborationPermission("editor", "edit_memory")).toBe(true);
    expect(withMember.members).toHaveLength(2);
    expect(withMember.version).toBe(2);
  });

  it("supports shared creation, version history, restore, and publish", () => {
    const object = createCollaborativeObject({
      kind: "memory_constellation",
      title: "Founders",
      ownerId: "waqar",
    });

    const added = addSharedObject(object, "star_1", "waqar");
    const removed = removeSharedObject(added, "star_1", "waqar");
    const restored = restoreCollaborativeObjectVersion(removed, 2, "waqar");
    const published = publishCollaborativeObject(restored, "waqar");
    const manualVersion = createCollaborationVersion({
      version: 99,
      actorId: "waqar",
      action: "published",
      snapshotObjectIds: published.objectIds,
    });

    expect(added.objectIds).toContain("star_1");
    expect(removed.objectIds).not.toContain("star_1");
    expect(restored.objectIds).toContain("star_1");
    expect(published.status).toBe("published");
    expect(manualVersion.version).toBe(99);
  });

  it("detects and resolves collaboration conflicts", () => {
    const object = createCollaborativeObject({
      kind: "shared_story",
      title: "Shared Story",
      ownerId: "waqar",
      objectIds: ["scene_1"],
    });

    const conflict = detectCollaborationConflict({
      objectId: "scene_1",
      actorA: "waqar",
      actorB: "ayesha",
      previousHash: "a",
      nextHash: "b",
    });

    const withConflict = attachCollaborationConflict(object, conflict);
    const resolved = resolveCollaborationConflict(withConflict, withConflict.conflicts[0].id, "waqar", "resolved");

    expect(withConflict.conflicts).toHaveLength(1);
    expect(resolved.conflicts[0].status).toBe("resolved");
    expect(resolved.versions.at(-1)?.action).toBe("merged");
  });

  it("supports live presence, reactions, typing, summaries, and intelligence", () => {
    const object = addCollaborationMember(
      createCollaborativeObject({
        kind: "shared_workspace",
        title: "Workspace",
        ownerId: "waqar",
      }),
      "ayesha",
      "contributor",
    );

    const live = updateCollaborationPresence(object, {
      userId: "ayesha",
      cursor: { x: 12, y: 34 },
      typing: true,
      reaction: "✦",
      updatedAt: new Date().toISOString(),
    });

    const liveSummary = summarizeLiveCollaboration(live);
    const suggestions = suggestCollaborators({
      object: live,
      candidateUserIds: ["ayesha", "hamza", "sara"],
      relationshipScores: { hamza: 0.72, sara: 0.91 },
    });
    const health = summarizeCollaborationHealth(live);
    const contribution = createContributionSummary(live);

    expect(liveSummary.activeUsers).toBe(1);
    expect(liveSummary.typingUsers).toContain("ayesha");
    expect(suggestions[0]).toBe("sara");
    expect(health.memberCount).toBe(2);
    expect(contribution).toContain("collaborators");
  });

  it("creates cross-portal collaboration adapters and manifest", () => {
    const object = createCollaborativeObject({
      kind: "shared_mood_board",
      title: "Mood Board",
      ownerId: "waqar",
      objectIds: ["mood_1"],
      portals: ["fyp", "lumaspace", "live", "creator_hub"],
    });

    const adapter = collaborationPortalAdapter(object, "lumaspace");
    const manifest = createCrossPortalCollaborationManifest(object);

    expect(adapter.label).toContain("LumaSpace");
    expect(manifest.identityPreserved).toBe(true);
    expect(manifest.adapters).toHaveLength(4);
    expect(manifest.portals).toContain("creator_hub");
  });
});
