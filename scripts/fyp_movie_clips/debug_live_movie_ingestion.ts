import { fetchArchiveSearchPage, fetchArchiveMetadata } from "../../src/lib/fyp_movie_clips/live/archive_live_fetch";
import { buildLiveArchiveCandidates } from "../../src/lib/fyp_movie_clips/live/archive_candidate_builder";
import { validateCandidateBeforeDownload } from "../../src/lib/fyp_movie_clips/live/live_ingestion_contract";

async function main() {
  const docs = await fetchArchiveSearchPage(fetch, 1);
  console.log("ARCHIVE_DOCS=", docs.length);
  console.log("DOC_SAMPLE=", docs.slice(0, 3).map((x) => ({ identifier: x.identifier, title: x.title, year: x.year })));

  for (const doc of docs.slice(0, 5)) {
    const meta = await fetchArchiveMetadata(fetch, doc.identifier);
    const files = meta?.files || [];
    const candidates = meta ? buildLiveArchiveCandidates(meta) : [];

    console.log("ITEM=", doc.identifier);
    console.log("FILES=", files.length);
    console.log("MP4_CANDIDATES=", candidates.length);
    console.log("CANDIDATE_SAMPLE=", candidates.slice(0, 2).map((x) => ({
      fileName: x.fileName,
      downloadUrl: x.downloadUrl,
      license: x.license,
      valid: validateCandidateBeforeDownload(x).ok,
    })));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
