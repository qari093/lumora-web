import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { tagMovieClipsForFyp, ensureMovieClipsPresence } from "../../src/lib/fyp_movie_clips/fyp_integration";
import { appendToMovieClipManifest, loadMovieClipManifest } from "../../src/lib/fyp_movie_clips/movie_manifest_loader";
import { disableMovieClips, enableMovieClips } from "../../src/lib/fyp_movie_clips/kill_switch";
import { filterMovieClipsRuntime } from "../../src/lib/fyp_movie_clips/runtime_guard";

describe("Safe Movie Clips Pack 4 — FYP integration", () => {
  it("tags movie clips", () => {
    const out = tagMovieClipsForFyp([{ id: "movie-1" }]);
    expect(out[0].sourceType).toBe("movie-clip");
  });

  it("ensures movie clip ratio", () => {
    const out = ensureMovieClipsPresence([{ id: "1", hasAudio: true }], 0.5);
    expect(out.length).toBeGreaterThan(1);
  });

  it("writes manifest safely", () => {
    const count = appendToMovieClipManifest([{ id: "m1" }]);
    expect(count).toBeGreaterThan(0);
    expect(loadMovieClipManifest().length).toBeGreaterThan(0);
  });

  it("kill switch disables movie clips", () => {
    disableMovieClips();
    const out = filterMovieClipsRuntime([{ id: "m", sourceType: "movie-clip" }]);
    expect(out.length).toBe(0);
    enableMovieClips();
  });

  it("manifest file exists", () => {
    expect(fs.existsSync("public/native-fyp/movie-meta/manifest.json")).toBe(true);
  });
});
