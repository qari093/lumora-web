import {
  createGmarCreatorProfile,
  createGmarCreatorDraft,
  submitGmarCreatorDraft,
  approveGmarCreatorDraft,
  publishGmarCreatorContent,
  assertGmarCreatorContent
} from "@/src/core/gmar/final-completion/creator/creatorPublishing";

describe("GMAR Final Completion Phase 10 — Creator Publishing Pipeline", () => {
  it("creates creator profile", () => {
    const creator = createGmarCreatorProfile({
      creatorId: "creator_origin",
      playerId: "gmar_user_001",
      displayName: "Origin Creator"
    });

    expect(creator.monetizationEnabled).toBe(true);
    expect(creator.analyticsReady).toBe(true);
    expect(creator.moderationReady).toBe(true);
  });

  it("publishes approved creator content", () => {
    const creator = createGmarCreatorProfile({
      creatorId: "creator_origin",
      playerId: "gmar_user_001",
      displayName: "Origin Creator"
    });

    const draft = createGmarCreatorDraft({
      contentId: "origin_clip_001",
      creator,
      title: "Origin Storm Victory",
      description: "Final battle clip."
    });

    expect(draft.status).toBe("draft");

    const submitted = submitGmarCreatorDraft(draft);

    expect(submitted.status).toBe("review");

    const approved = approveGmarCreatorDraft(submitted);

    expect(approved.status).toBe("approved");
    expect(approved.moderationPassed).toBe(true);

    const published = publishGmarCreatorContent({
      content: approved,
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(published.status).toBe("published");
    expect(published.publishedAt).toBe("2026-05-09T00:00:00.000Z");

    expect(assertGmarCreatorContent(published)).toBe(true);
  });

  it("rejects publishing non-approved content", () => {
    const creator = createGmarCreatorProfile({
      creatorId: "creator_origin",
      playerId: "gmar_user_001",
      displayName: "Origin Creator"
    });

    const draft = createGmarCreatorDraft({
      contentId: "origin_clip_001",
      creator,
      title: "Origin Storm Victory",
      description: "Final battle clip."
    });

    expect(() =>
      publishGmarCreatorContent({
        content: draft
      })
    ).toThrow("GMAR creator content must be approved before publishing.");
  });

  it("rejects invalid creator profile", () => {
    expect(() =>
      createGmarCreatorProfile({
        creatorId: " ",
        playerId: " ",
        displayName: " "
      })
    ).toThrow(
      "GMAR creator profile requires creatorId, playerId, and displayName."
    );
  });
});
