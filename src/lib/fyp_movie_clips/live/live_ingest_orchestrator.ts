import fs from "node:fs";
import { fetchArchiveSearchPage, fetchArchiveMetadata } from "./archive_live_fetch";
import { buildLiveArchiveCandidates } from "./archive_candidate_builder";
import { buildMovieDownloadPlan } from "./download_plan";
import { validateCandidateBeforeDownload } from "./live_ingestion_contract";
import { downloadMovieFile } from "./download_executor";
import { validateDownloadedMovieAudio } from "./audio_validation";
import { trimMovieClip } from "./trim_executor";
import { writeLiveMovieManifest } from "./live_manifest_writer";

export async function runLiveMovieIngestion(fetcher: typeof fetch) {
  const results: any[] = [];

  let docs: any[] = [];
  try {
    docs = await fetchArchiveSearchPage(fetcher, 1);
  } catch (error: any) {
    console.log("ARCHIVE_SEARCH_ERROR=", error?.message || String(error));
    return results;
  }

  for (const doc of docs.slice(0, 6)) {
    let meta: any = null;

    try {
      meta = await fetchArchiveMetadata(fetcher, doc.identifier);
    } catch (error: any) {
      console.log("ARCHIVE_METADATA_ERROR=", doc.identifier, error?.message || String(error));
      continue;
    }

    if (!meta) continue;

    const candidates = buildLiveArchiveCandidates(meta);

    for (const candidate of candidates.slice(0, 2)) {
      const valid = validateCandidateBeforeDownload(candidate);
      if (!valid.ok) continue;

      const plan = buildMovieDownloadPlan(candidate, results.length);
      const clipPath = plan.finalPath.replace(".mp4", "_clip.mp4");
      const clipLocalUrl = plan.localUrl.replace(".mp4", "_clip.mp4");

      const downloaded = await downloadMovieFile(plan);
      if (!downloaded) continue;

      const audioOk = validateDownloadedMovieAudio(plan.finalPath);
      if (!audioOk) {
        try { fs.unlinkSync(plan.finalPath); } catch {}
        continue;
      }

      const trimmed = trimMovieClip(plan.finalPath, clipPath, 120);
      try { fs.unlinkSync(plan.finalPath); } catch {}

      if (!trimmed) continue;
      if (!fs.existsSync(clipPath)) continue;

      const record = {
        id: candidate.id,
        title: candidate.title || "Lumora Movie Moment",
        localUrl: clipLocalUrl,
        sourceType: "movie-clip" as const,
        sourceId: candidate.sourceId,
        sourceUrl: candidate.sourceUrl,
        license: candidate.license,
        hasAudio: true as const,
        duration: 18,
        mood: candidate.mood || "cinematic",
        category: candidate.category || "Movie Moment",
      };

      results.push(record);

      // Critical: persist immediately so later network failures do not lose successful clips.
      writeLiveMovieManifest([record]);
      console.log("MOVIE_CLIP_WRITTEN=", clipLocalUrl);

      if (results.length >= 4) return results;
    }
  }

  return results;
}
