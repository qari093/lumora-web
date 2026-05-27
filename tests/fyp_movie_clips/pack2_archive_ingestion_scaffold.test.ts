import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { ARCHIVE_MOVIE_QUERIES, buildArchiveAdvancedSearchUrl, buildArchiveMetadataUrl } from "../../src/lib/fyp_movie_clips/archive_search";
import { buildArchiveDownloadUrl, selectArchiveMovieFiles } from "../../src/lib/fyp_movie_clips/archive_files";
import { buildMovieClipManifestItem, mergeMovieClipManifest } from "../../src/lib/fyp_movie_clips/movie_manifest";
import { inferMovieClipCategory, inferMovieClipMood } from "../../src/lib/fyp_movie_clips/mood_tags";

describe("Safe Movie Clips Pack 2 — archive ingestion scaffold", () => {
  it("builds archive search URLs", () => {
    const url = buildArchiveAdvancedSearchUrl(ARCHIVE_MOVIE_QUERIES[0], 2);
    expect(url).toContain("advancedsearch.php");
    expect(url).toContain("output=json");
  });

  it("builds metadata and download URLs", () => {
    expect(buildArchiveMetadataUrl("abc")).toContain("/metadata/abc");
    expect(buildArchiveDownloadUrl("abc", "clip.mp4")).toContain("/download/abc/clip.mp4");
  });

  it("selects usable mp4 candidates and rejects likely silent files", () => {
    const out = selectArchiveMovieFiles([
      { name: "silent_movie.mp4", format: "MPEG4", size: "500000" },
      { name: "movie_sound.mp4", format: "MPEG4", size: "500000" },
      { name: "tiny.mp4", format: "MPEG4", size: "10" },
    ]);

    expect(out).toHaveLength(1);
    expect(out[0].name).toBe("movie_sound.mp4");
  });

  it("builds and merges movie manifest items", () => {
    const item = buildMovieClipManifestItem({
      id: "m1",
      title: "Test",
      sourceId: "archive",
      sourceUrl: "https://archive.org/details/test",
      license: "public domain",
      licenseProof: { sourceId: "archive", sourceUrl: "x", license: "public domain", checkedAt: "now", safe: true },
      localUrl: "/native-fyp/movie-clips/m1.mp4",
      duration: 20,
      hasAudio: true,
      audioCodec: "aac",
      mood: "cinematic",
      category: "Movie Moment",
    });

    expect(mergeMovieClipManifest([], [item, item])).toHaveLength(1);
  });

  it("infers movie mood/category and has scaffold script", () => {
    expect(inferMovieClipMood("funny comedy voice")).toBe("amused");
    expect(inferMovieClipCategory("public domain drama")).toBe("Drama");
    expect(fs.existsSync("scripts/fyp_movie_clips/ingest_archive_movie_clips.mjs")).toBe(true);
  });
});
