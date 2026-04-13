import { describe, expect, it } from "vitest";
import { buildCreatorProfile } from "../../lib/creator/profileSystem";

describe("creator profile system", () => {
  it("builds a valid creator profile", () => {
    const result = buildCreatorProfile({
      id: "creator_1",
      handle: "@Lumora.Creator",
      displayName: "Lumora Creator",
      bio: "Building calm and powerful media.",
      avatarUrl: "https://cdn.example.com/avatar.png",
      tags: ["Video", "Creator", "Video"],
      verified: true
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.profile.handle).toBe("@lumora.creator");
      expect(result.profile.slug).toBe("lumora.creator");
      expect(result.profile.tags).toEqual(["video", "creator"]);
      expect(result.profile.verified).toBe(true);
    }
  });

  it("rejects invalid handle", () => {
    const result = buildCreatorProfile({
      id: "creator_1",
      handle: "@@",
      displayName: "Lumora Creator"
    });

    expect(result).toEqual({ ok: false, error: "invalid_handle" });
  });

  it("rejects invalid avatar url", () => {
    const result = buildCreatorProfile({
      id: "creator_1",
      handle: "@valid_handle",
      displayName: "Lumora Creator",
      avatarUrl: "/avatar.png"
    });

    expect(result).toEqual({ ok: false, error: "invalid_avatar_url" });
  });

  it("rejects oversized bio", () => {
    const result = buildCreatorProfile({
      id: "creator_1",
      handle: "@valid_handle",
      displayName: "Lumora Creator",
      bio: "x".repeat(281)
    });

    expect(result).toEqual({ ok: false, error: "invalid_bio" });
  });
});
