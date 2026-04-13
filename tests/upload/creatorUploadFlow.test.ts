import { describe, expect, it } from "vitest";
import { finalizeCreatorUpload } from "../../lib/upload/creatorUploadFlow";

describe("creator upload flow finalization", () => {
  it("accepts a valid upload", () => {
    const result = finalizeCreatorUpload({
      title: "My Clip",
      creatorId: "creator_1",
      mediaUrl: "https://cdn.example.com/video.mp4",
      mimeType: "video/mp4",
      visibility: "public",
      tags: ["fun", "fun", "sports"]
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.upload.status).toBe("queued");
      expect(result.upload.tags).toEqual(["fun", "sports"]);
    }
  });

  it("rejects invalid title", () => {
    const result = finalizeCreatorUpload({
      title: "x",
      creatorId: "creator_1",
      mediaUrl: "https://cdn.example.com/video.mp4",
      mimeType: "video/mp4"
    });

    expect(result).toEqual({ ok: false, error: "invalid_title" });
  });

  it("rejects invalid media url", () => {
    const result = finalizeCreatorUpload({
      title: "Valid Title",
      creatorId: "creator_1",
      mediaUrl: "/local/file.mp4",
      mimeType: "video/mp4"
    });

    expect(result).toEqual({ ok: false, error: "invalid_media_url" });
  });

  it("rejects invalid mime type", () => {
    const result = finalizeCreatorUpload({
      title: "Valid Title",
      creatorId: "creator_1",
      mediaUrl: "https://cdn.example.com/file.mov",
      mimeType: "video/mov"
    });

    expect(result).toEqual({ ok: false, error: "invalid_mime_type" });
  });
});
