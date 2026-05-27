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
  "dogs playing",
  "street food",
  "city street",
  "cars driving",
  "travel adventure",
];

function readManifest() {
  if (!fssync.existsSync(MANIFEST)) return [];
  try {
    return JSON.parse(fssync.readFileSync(MANIFEST, "utf8"));
  } catch {
    return [];
  }
}

function nextIndex(existing) {
  const max = existing
    .map((x) => Number(x.id) || 0)
    .sort((a, b) => b - a)[0];

  return (max ?? 0) + 1;
}

function normalizeClip(clip) {
  return {
    source: clip.source,
    sourceId: String(clip.sourceId),
    sourceUrl: clip.sourceUrl,
    title: clip.title,
    query: clip.query,
    mp4Url: clip.mp4Url,
    width: Number(clip.width || 0),
    height: Number(clip.height || 0),
    duration: Number(clip.duration || 0),
    license: clip.license,
  };
}

async function fetchPexels(query, page = 1) {
  if (!process.env.PEXELS_API_KEY) return [];

  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=8&page=${page}`,
    { headers: { Authorization: process.env.PEXELS_API_KEY } },
  );

  if (!res.ok) return [];

  const json = await res.json();

  return (json.videos ?? [])
    .map((v) => {
      const file = [...(v.video_files ?? [])]
        .filter((f) => f.file_type === "video/mp4" && f.width && f.height && f.height >= f.width)
        .sort((a, b) => Math.abs(a.width / a.height - 9 / 16) - Math.abs(b.width / b.height - 9 / 16))[0];

      if (!file?.link) return null;

      return normalizeClip({
        source: "pexels",
        sourceId: v.id,
        sourceUrl: v.url,
        title: `Pexels ${query}`,
        query,
        mp4Url: file.link,
        width: file.width,
        height: file.height,
        duration: v.duration,
        license: "pexels",
      });
    })
    .filter(Boolean);
}

async function fetchPixabay(query, page = 1) {
  if (!process.env.PIXABAY_API_KEY) return [];

  const res = await fetch(
    `https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=8&page=${page}&safesearch=true`,
  );

  if (!res.ok) return [];

  const json = await res.json();

  return (json.hits ?? [])
    .map((v) => {
      const file = v.videos?.medium || v.videos?.small || v.videos?.large;
      if (!file?.url) return null;

      return normalizeClip({
        source: "pixabay",
        sourceId: v.id,
        sourceUrl: v.pageURL,
        title: `Pixabay ${query}`,
        query,
        mp4Url: file.url,
        width: file.width,
        height: file.height,
        duration: v.duration ?? 10,
        license: "pixabay",
      });
    })
    .filter((clip) => clip && clip.height >= clip.width);
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
const seenUrls = new Set(existing.map((x) => x.mp4Url).filter(Boolean));
const seenSourceKeys = new Set(existing.map((x) => `${x.source}:${x.sourceId || x.pexelsId || x.id}`));

let id = nextIndex(existing);
const additions = [];

for (let round = 0; round < 3; round++) {
  for (const query of queries) {
    const batch = [
      ...(await fetchPexels(query, round + 1)),
      ...(await fetchPixabay(query, round + 1)),
    ];

    for (const clip of batch) {
      const sourceKey = `${clip.source}:${clip.sourceId}`;

      if (seenUrls.has(clip.mp4Url)) continue;
      if (seenSourceKeys.has(sourceKey)) continue;

      const localPath = path.join(OUT_DIR, `${id}.mp4`);
      const ok = await download(clip.mp4Url, localPath);
      if (!ok) continue;

      const record = {
        id,
        localUrl: `/native-fyp/real/${id}.mp4`,
        downloadedAt: new Date().toISOString(),
        ...clip,
      };

      existing.push(record);
      additions.push(record);
      seenUrls.add(clip.mp4Url);
      seenSourceKeys.add(sourceKey);

      console.log(`✓ added ${id}: ${clip.source} ${query}`);
      id++;

      if (additions.length >= 40) break;
    }

    if (additions.length >= 40) break;
  }

  if (additions.length >= 40) break;
}

await fs.writeFile(MANIFEST, JSON.stringify(existing, null, 2));

console.log(`MULTISOURCE_APPENDED=${additions.length}`);
console.log(`TOTAL_MANIFEST=${existing.length}`);

if (additions.length < 1) {
  throw new Error(`No multisource clips appended: ${additions.length}`);
}
