import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

const OUT_DIR = "public/native-fyp/real";
const META_DIR = "public/native-fyp/real-meta";
const MANIFEST = `${META_DIR}/manifest.json`;

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(META_DIR, { recursive: true });

const queries = [
  "football match",
  "basketball game",
  "tennis match",
  "boxing training",
  "gym workout",
  "running race",
  "marathon runners",
  "soccer training",
  "baseball game",
  "volleyball game",
  "swimming competition",
  "fitness training",
  "street food",
  "cooking food",
  "animals funny",
  "dogs playing",
  "cats playing",
  "city street",
  "night city",
  "travel adventure",
  "cars driving",
  "motorcycle ride",
  "concert crowd",
  "people dancing",
  "festival crowd",
  "nature wildlife",
  "ocean waves",
  "mountain hiking",
  "technology screen",
  "fashion street"
];

function readManifest() {
  if (!fssync.existsSync(MANIFEST)) return [];
  try {
    return JSON.parse(fssync.readFileSync(MANIFEST, "utf8"));
  } catch {
    return [];
  }
}

function nextIndex() {
  const files = fssync.existsSync(OUT_DIR)
    ? fssync.readdirSync(OUT_DIR).filter((f) => f.endsWith(".mp4"))
    : [];

  const max = files
    .map((f) => Number(f.replace(".mp4", "")))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];

  return (max ?? 0) + 1;
}

async function fetchPexels(query, page) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=15&page=${page}`;

  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!res.ok) {
    console.log(`skip query=${query} page=${page} status=${res.status}`);
    return [];
  }

  const json = await res.json();

  return (json.videos ?? [])
    .map((v) => {
      const file = [...(v.video_files ?? [])]
        .filter((f) => f.file_type === "video/mp4" && f.width && f.height && f.height >= f.width)
        .sort((a, b) => {
          const ar = Math.abs((a.width / a.height) - (9 / 16));
          const br = Math.abs((b.width / b.height) - (9 / 16));
          return ar - br;
        })[0];

      if (!file?.link) return null;

      return {
        pexelsId: v.id,
        source: "pexels",
        sourceUrl: v.url,
        title: `Pexels ${query}`,
        query,
        page,
        mp4Url: file.link,
        width: file.width,
        height: file.height,
        duration: v.duration,
        license: "pexels",
      };
    })
    .filter(Boolean);
}

async function download(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) return false;

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 80_000) return false;

  await fs.writeFile(filepath, buffer);
  return true;
}

const existing = readManifest();
const seenUrls = new Set(existing.map((x) => x.mp4Url));
const seenIds = new Set(existing.map((x) => String(x.pexelsId)));
const additions = [];

let index = nextIndex();
let pageSeed = Math.max(1, Math.floor(existing.length / 15) + 1);

for (const query of queries) {
  for (let page = pageSeed; page < pageSeed + 3; page++) {
    const clips = await fetchPexels(query, page);

    for (const clip of clips) {
      if (seenUrls.has(clip.mp4Url)) continue;
      if (seenIds.has(String(clip.pexelsId))) continue;

      const filepath = path.join(OUT_DIR, `${index}.mp4`);
      const ok = await download(clip.mp4Url, filepath);
      if (!ok) continue;

      const record = {
        id: index,
        localUrl: `/native-fyp/real/${index}.mp4`,
        downloadedAt: new Date().toISOString(),
        ...clip,
      };

      additions.push(record);
      existing.push(record);
      seenUrls.add(clip.mp4Url);
      seenIds.add(String(clip.pexelsId));

      console.log(`✓ appended ${index}: ${query} p${page}`);
      index++;

      if (additions.length >= 60) break;
    }

    if (additions.length >= 60) break;
  }

  if (additions.length >= 60) break;
}

await fs.writeFile(MANIFEST, JSON.stringify(existing, null, 2));

console.log(`APPENDED=${additions.length}`);
console.log(`TOTAL_MANIFEST=${existing.length}`);

if (additions.length < 15) {
  throw new Error(`Not enough new unique clips appended: ${additions.length}`);
}
