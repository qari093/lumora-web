import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { fetchArchiveMetadata, fetchArchiveSearchPage } from "../../../src/lib/fyp_movie_clips/live/archive_live_fetch";
import { buildLiveArchiveCandidates } from "../../../src/lib/fyp_movie_clips/live/archive_candidate_builder";
import { buildMovieDownloadPlan } from "../../../src/lib/fyp_movie_clips/live/download_plan";
import { validateCandidateBeforeDownload } from "../../../src/lib/fyp_movie_clips/live/live_ingestion_contract";

describe("Movie ingestion live Pack 1 — archive fetch + candidate plan", () => {
  const fakeFetch: any = async (url: string) => ({
    ok: true,
    json: async () =>
      url.includes("advancedsearch")
        ? { response: { docs: [{ identifier: "test-film", title: "Test Film" }] } }
        : {
            metadata: { identifier: "test-film", title: "Test Film", licenseurl: "public domain" },
            files: [{ name: "test-film.mp4", format: "MPEG4", size: "500000" }],
          },
  });

  it("fetches archive search docs", async () => {
    const docs = await fetchArchiveSearchPage(fakeFetch, 1);
    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0].identifier).toBe("test-film");
  });

  it("fetches metadata", async () => {
    const meta = await fetchArchiveMetadata(fakeFetch, "test-film");
    expect(meta?.metadata?.identifier).toBe("test-film");
  });

  it("builds candidates from metadata", async () => {
    const meta = await fetchArchiveMetadata(fakeFetch, "test-film");
    const candidates = buildLiveArchiveCandidates(meta!);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].downloadUrl).toContain(".mp4");
  });

  it("builds download plan and validates before download", async () => {
    const meta = await fetchArchiveMetadata(fakeFetch, "test-film");
    const candidate = buildLiveArchiveCandidates(meta!)[0];
    const plan = buildMovieDownloadPlan(candidate, 0);
    const valid = validateCandidateBeforeDownload(candidate);

    expect(plan.localUrl).toContain("/native-fyp/movie-clips/");
    expect(valid.ok).toBe(true);
  });

  it("has preview script and directories", () => {
    expect(fs.existsSync("scripts/fyp_movie_clips/live_archive_ingest_preview.mjs")).toBe(true);
    expect(fs.existsSync("public/native-fyp/movie-clips")).toBe(true);
  });
});
