import { describe, expect, it } from "vitest";
import { validateNativeUploadInput } from "../../src/lib/native-fyp/content/uploadContract";
import { createNativeVideoId } from "../../src/lib/native-fyp/content/id";

describe("native fyp content pack 001", () => {
  it("accepts valid mp4 upload input", () => {
    const result = validateNativeUploadInput({
      title: "Clip",
      filename: "clip.mp4",
      mimeType: "video/mp4",
      sizeBytes: 1000,
      durationSeconds: 20,
      rightsConfirmed: true,
    });

    expect(result.ok).toBe(true);
  });

  it("blocks unknown rights", () => {
    const result = validateNativeUploadInput({
      title: "Clip",
      filename: "clip.mp4",
      mimeType: "video/mp4",
      sizeBytes: 1000,
      durationSeconds: 20,
      rightsConfirmed: false,
    });

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("rights_not_confirmed");
  });

  it("creates native video id", () => {
    expect(createNativeVideoId("My Clip.mp4")).toContain("nfyp_my_clip_mp4");
  });
});
