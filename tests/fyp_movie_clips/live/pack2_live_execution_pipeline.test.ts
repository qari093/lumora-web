import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateDownloadedMovieAudio } from "../../../src/lib/fyp_movie_clips/live/audio_validation";

describe("Movie ingestion live Pack 2 — execution pipeline", () => {
  it("audio validator rejects non-existing file", () => {
    expect(validateDownloadedMovieAudio("nonexistent.mp4")).toBe(false);
  });

  it("pipeline files exist", () => {
    expect(fs.existsSync("src/lib/fyp_movie_clips/live/download_executor.ts")).toBe(true);
    expect(fs.existsSync("src/lib/fyp_movie_clips/live/ffprobe_runner.ts")).toBe(true);
    expect(fs.existsSync("src/lib/fyp_movie_clips/live/trim_executor.ts")).toBe(true);
    expect(fs.existsSync("src/lib/fyp_movie_clips/live/live_ingest_orchestrator.ts")).toBe(true);
  });
});
