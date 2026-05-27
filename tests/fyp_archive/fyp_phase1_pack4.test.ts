import { describe, expect, it } from "vitest";
import {
  buildArchiveSearchUrl,
  extractArchiveVideoCandidates,
  mergeArchiveIntoManifest,
  normalizeArchiveManifestItem,
} from "../../src/lib/fyp_archive/metadata_pipeline";

describe("Phase 1 Pack 4 — Archive Metadata Pipeline", () => {
  it("builds archive search URL", () => {
    const url = buildArchiveSearchUrl("home movie", 2);
    expect(url).toContain("archive.org/advancedsearch.php");
    expect(url).toContain("output=json");
    expect(url).toContain("page=2");
  });

  it("extracts video file candidates", () => {
    const files = extractArchiveVideoCandidates({
      files: [
        { name: "clip.mp4", format: "MPEG4" },
        { name: "notes.txt", format: "Text" },
      ],
    });

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe("clip.mp4");
  });

  it("normalizes archive item to manifest shape", () => {
    const out = normalizeArchiveManifestItem(
      { identifier: "abc", title: "Home Movie" },
      { name: "clip.mp4" },
      { query: "home movie", decade: "1960s" },
    );

    expect(out.source).toBe("archive");
    expect(out.sourceId).toBe("abc");
    expect(out.mp4Url).toContain("archive.org/download/abc");
    expect(out.decade).toBe("1960s");
  });

  it("merges archive items without duplicates", () => {
    const merged = mergeArchiveIntoManifest(
      [{ source: "archive", sourceId: "a", archiveFile: "1.mp4" }],
      [
        { source: "archive", sourceId: "a", archiveFile: "1.mp4" },
        { source: "archive", sourceId: "b", archiveFile: "2.mp4" },
      ],
    );

    expect(merged).toHaveLength(2);
  });
});
