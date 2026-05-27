import { describe, expect, it } from "vitest";
import { SAFE_MOVIE_SOURCES, isSafeMovieSource } from "../../src/lib/fyp_movie_clips/legal_sources";
import { isSafeMovieClipLicense, buildLicenseProof } from "../../src/lib/fyp_movie_clips/license_guard";
import { hasValidAudioTrack, shouldRejectSilentMovieClip, isValidMovieClipDuration } from "../../src/lib/fyp_movie_clips/audio_guard";
import { validateSafeMovieClip } from "../../src/lib/fyp_movie_clips/movie_clip_contract";

describe("Safe Movie Clips Pack 1 — foundation rules", () => {
  it("locks safe legal sources", () => {
    expect(SAFE_MOVIE_SOURCES.length).toBeGreaterThanOrEqual(3);
    expect(isSafeMovieSource("internet-archive-public-domain")).toBe(true);
  });

  it("rejects unsafe licenses", () => {
    expect(isSafeMovieClipLicense({ sourceId: "internet-archive-public-domain", license: "all rights reserved" })).toBe(false);
    expect(isSafeMovieClipLicense({ sourceId: "internet-archive-public-domain", license: "public domain" })).toBe(true);
  });

  it("stores license proof", () => {
    const proof = buildLicenseProof({
      sourceId: "prelinger-archives",
      sourceUrl: "https://archive.org/details/example",
      license: "public domain",
    });

    expect(proof.safe).toBe(true);
    expect(proof.sourceUrl).toContain("archive.org");
  });

  it("rejects clips without audio", () => {
    expect(hasValidAudioTrack({ hasAudioTrack: true, audioCodec: "aac" })).toBe(true);
    expect(shouldRejectSilentMovieClip({ hasAudioTrack: false })).toBe(true);
  });

  it("validates full safe movie clip contract", () => {
    const out = validateSafeMovieClip({
      id: "clip-1",
      title: "Safe clip",
      sourceId: "internet-archive-public-domain",
      sourceUrl: "https://archive.org/details/safe",
      license: "public domain",
      duration: 20,
      audio: { hasAudioTrack: true, audioCodec: "aac", volumeDb: -18 },
    });

    expect(out.ok).toBe(true);
    expect(isValidMovieClipDuration(20)).toBe(true);
  });
});
