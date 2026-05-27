import fs from "node:fs";

fs.mkdirSync("public/native-fyp/movie-clips", { recursive: true });
fs.mkdirSync("public/native-fyp/movie-meta", { recursive: true });

if (!fs.existsSync("public/native-fyp/movie-meta/manifest.json")) {
  fs.writeFileSync("public/native-fyp/movie-meta/manifest.json", "[]\n");
}

console.log("LIVE_ARCHIVE_INGEST_PREVIEW_READY=true");
console.log("NEXT=wire network fetch + ffprobe download execution");
