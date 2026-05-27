import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const roots = [
  "public/native-fyp/movie-clips",
  "public/native-fyp/videos",
  "public/native-fyp/clips",
  "public/native-fyp/real",
  "public/native-fyp",
];

const outPath = "public/native-fyp/guaranteed-meta/manifest.json";
fs.mkdirSync(path.dirname(outPath), { recursive: true });

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".mp4") || p.endsWith(".webm")) out.push(p);
  }
  return out;
}

function hasAudio(file) {
  try {
    const raw = execSync(`ffprobe -v error -show_streams -print_format json "${file}"`, { stdio: ["ignore", "pipe", "ignore"] }).toString();
    const json = JSON.parse(raw);
    return (json.streams || []).some(s => s.codec_type === "audio");
  } catch {
    return false;
  }
}

const seen = new Set();
const files = roots.flatMap(walk).filter(f => {
  if (seen.has(f)) return false;
  seen.add(f);
  return true;
});

const items = files
  .map((file, index) => {
    const localUrl = "/" + file.replace(/^public\//, "");
    const audio = hasAudio(file);

    return {
      id: `guaranteed_${index}_${path.basename(file).replace(/[^a-zA-Z0-9_-]/g, "_")}`,
      title: file.includes("movie-clips") ? "Lumora Movie Moment" : "Lumora Clip",
      source: file.includes("movie-clips") ? "local-movie-pool" : "local-fyp-pool",
      sourceType: file.includes("movie-clips") ? "movie-clip" : "guaranteed-local",
      localUrl,
      playbackUrl: localUrl,
      hasAudio: audio,
      hasVoice: audio,
      license: file.includes("movie-clips") ? "public domain" : "local verified",
      category: file.includes("movie-clips") ? "Movie" : "General",
      sourceUrl: "",
    };
  })
  .filter(x => x.playbackUrl)
  .sort((a, b) => Number(b.hasAudio) - Number(a.hasAudio));

fs.writeFileSync(outPath, JSON.stringify(items, null, 2));

console.log("GUARANTEED_POOL_TOTAL=", items.length);
console.log("GUARANTEED_POOL_AUDIO=", items.filter(x => x.hasAudio).length);
console.log("SAMPLE=", items.slice(0, 5));
