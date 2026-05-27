import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  readLiveMovieManifest,
  writeLiveMovieManifest,
} from "../../../src/lib/fyp_movie_clips/live/live_manifest_writer";
import {
  buildMovieClipFypItems,
  injectMovieClipsIntoFyp,
} from "../../../src/lib/fyp_movie_clips/live/fyp_movie_bridge";

describe("Movie ingestion live Pack 3 — manifest + FYP bridge", () => {
  it("writes and reads movie manifest records", () => {
    const before = readLiveMovieManifest().length;

    const merged = writeLiveMovieManifest([
      {
        id: "test-live-movie",
        title: "Test Movie Moment",
        localUrl: "/native-fyp/movie-clips/test-live-movie.mp4",
        sourceType: "movie-clip",
        hasAudio: true,
        duration: 20,
      },
    ]);

    expect(merged.length).toBeGreaterThanOrEqual(before);
  });

  it("builds FYP movie items safely", () => {
    const out = buildMovieClipFypItems();
    expect(Array.isArray(out)).toBe(true);
  });

  it("injects movie clips without breaking fallback when none playable", () => {
    const existing = [{ id: "real_1", sourceType: "social", playbackUrl: "/x.mp4" }];
    const out = injectMovieClipsIntoFyp(existing, 0.2);

    expect(out.length).toBeGreaterThan(0);
    expect(out.some((x) => x.id === "real_1")).toBe(true);
  });

  it("creates live ingestion runner script", () => {
    expect(fs.existsSync("scripts/fyp_movie_clips/run_live_movie_ingestion.mjs")).toBe(true);
  });
});
