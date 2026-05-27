import { describe, expect, it } from "vitest";
import { createContentManifest } from "../../src/lib/native-fyp/content/manifest";
import { addToNativeLibrary, listNativeLibrary } from "../../src/lib/native-fyp/content/library";

describe("native fyp content pack 002", () => {
  it("creates content manifest", () => {
    const m = createContentManifest({
      videoId: "v1",
      title: "Clip",
      playbackUrl: "/native-fyp/v1.mp4",
      posterUrl: "/native-fyp/v1.jpg",
      durationSeconds: 20,
      rightsStatus: "verified",
      licenseType: "creator_grant",
    });

    expect(m.createdAt).toBeTruthy();
  });

  it("adds unique content to library", () => {
    const m = createContentManifest({
      videoId: "v1",
      title: "Clip",
      playbackUrl: "/native-fyp/v1.mp4",
      posterUrl: "/native-fyp/v1.jpg",
      durationSeconds: 20,
      rightsStatus: "verified",
      licenseType: "creator_grant",
    });

    const library = addToNativeLibrary([], m);
    const duplicate = addToNativeLibrary(library, m);

    expect(library.length).toBe(1);
    expect(duplicate.length).toBe(1);
  });

  it("lists library", () => {
    expect(listNativeLibrary([])).toEqual([]);
  });
});
