import fs from "node:fs";
import { runLiveMovieIngestion } from "../../src/lib/fyp_movie_clips/live/live_ingest_orchestrator";
import { writeLiveMovieManifest } from "../../src/lib/fyp_movie_clips/live/live_manifest_writer";

fs.mkdirSync("public/native-fyp/movie-meta", { recursive: true });
fs.mkdirSync("public/native-fyp/movie-clips", { recursive: true });

if (!fs.existsSync("public/native-fyp/movie-meta/manifest.json")) {
  fs.writeFileSync("public/native-fyp/movie-meta/manifest.json", "[]\n");
}

async function main() {
  const result = await runLiveMovieIngestion(fetch);
  const merged = writeLiveMovieManifest(result);

  console.log("LIVE_MOVIE_INGESTED=" + result.length);
  console.log("LIVE_MOVIE_MANIFEST_TOTAL=" + merged.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
