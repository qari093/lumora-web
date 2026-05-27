import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "public/native-fyp/real";
const MANIFEST_PATH = "public/native-fyp/real-meta/manifest.json";

const REAL_LIFE_QUERIES = [
  "people arguing street",
  "funny public fail",
  "crowd reaction surprise",
  "kids laughing playing",
  "unexpected moment real life",
  "public interview reaction",
  "street performance crowd",
  "festival crowd dancing",
  "wedding funny moment",
  "airport emotional goodbye",
  "sports celebration crowd",
  "football fans cheering",
  "basketball crowd reaction",
  "street musician crowd",
  "people dancing street",
  "public celebration",
  "family funny moment",
  "dog funny moment",
  "cat funny moment",
  "street market people",
  "city crowd walking",
  "train station crowd",
  "concert fans cheering",
  "school kids playing",
  "friends laughing",
  "people running street",
  "public event crowd",
  "street food people",
  "people reaction face",
  "community festival"
];

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeManifest(items) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(items, null, 2));
}

function nextId(items) {
  const manifestMax = Math.max(0, ...items.map((x) => Number(x.id) || 0));
  const fileMax = fs.existsSync(OUT_DIR)
    ? Math.max(
        0,
        ...fs.readdirSync(OUT_DIR)
          .filter((x) => x.endsWith(".mp4"))
          .map((x) => Number(x.replace(".mp4", "")) || 0),
      )
    : 0;

  return Math.max(manifestMax, fileMax) + 1;
}

function isHumanQuery(query) {
  const q = query.toLowerCase();
  return [
    "people",
    "crowd",
    "kids",
    "public",
    "reaction",
    "street",
    "fans",
    "family",
    "friends",
    "wedding",
    "airport",
    "festival",
    "concert",
    "school",
  ].some((term) => q.includes(term));
}

function isGoodDuration(duration) {
  const d = Number(duration || 0);
  return d >= 8 && d <= 45;
}

function isPreferredDuration(duration) {
  const d = Number(duration || 0);
  return d >= 10 && d <= 30;
}

async function fetchPexels(query, page) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=15&page=${page}`;

  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!res.ok) return [];

  const json = await res.json();

  return (json.videos || [])
    .map((video) => {
      const file = [...(video.video_files || [])]
        .filter((f) => f.file_type === "video/mp4" && f.width && f.height && f.height >= f.width)
        .sort((a, b) => {
          const aScore = Math.abs((a.width / a.height) - (9 / 16));
          const bScore = Math.abs((b.width / b.height) - (9 / 16));
          return aScore - bScore;
        })[0];

      if (!file?.link) return null;

      return {
        source: "pexels",
        sourceId: String(video.id),
        sourceUrl: video.url,
        title: `Real Life · ${query}`,
        query,
        mp4Url: file.link,
        width: file.width,
        height: file.height,
        duration: Number(video.duration || 0),
        license: "pexels",
        humanBiased: isHumanQuery(query),
        preferredDuration: isPreferredDuration(video.duration),
      };
    })
    .filter(Boolean)
    .filter((clip) => isGoodDuration(clip.duration));
}

async function fetchPixabay(query, page) {
  if (!process.env.PIXABAY_API_KEY) return [];

  const url = `https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=15&page=${page}&safesearch=true&video_type=film`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const json = await res.json();

  return (json.hits || [])
    .map((video) => {
      const file = video.videos?.medium || video.videos?.small || video.videos?.large;
      if (!file?.url) return null;

      return {
        source: "pixabay",
        sourceId: String(video.id),
        sourceUrl: video.pageURL,
        title: `Real Life · ${query}`,
        query,
        mp4Url: file.url,
        width: file.width,
        height: file.height,
        duration: Number(video.duration || 0),
        license: "pixabay",
        humanBiased: isHumanQuery(query),
        preferredDuration: isPreferredDuration(video.duration),
      };
    })
    .filter(Boolean)
    .filter((clip) => clip.height >= clip.width)
    .filter((clip) => isGoodDuration(clip.duration));
}

async function downloadClip(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) return false;

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 100_000) return false;

  await fsp.writeFile(filePath, buffer);
  return true;
}

function buildSeenSets(manifest) {
  return {
    keys: new Set(manifest.map((x) => `${x.source}:${x.sourceId || x.pexelsId || x.id}`)),
    urls: new Set(manifest.map((x) => x.mp4Url).filter(Boolean)),
  };
}

const manifest = readManifest();
const seen = buildSeenSets(manifest);
let id = nextId(manifest);

const additions = [];
const perQuery = new Map();

for (let page = 1; page <= 10; page++) {
  for (const query of REAL_LIFE_QUERIES) {
    const currentQueryCount = perQuery.get(query) || 0;
    if (currentQueryCount >= 10) continue;

    const batch = [
      ...(await fetchPexels(query, page)),
      ...(await fetchPixabay(query, page)),
    ].sort((a, b) => {
      const human = Number(b.humanBiased) - Number(a.humanBiased);
      if (human !== 0) return human;
      return Number(b.preferredDuration) - Number(a.preferredDuration);
    });

    for (const clip of batch) {
      const key = `${clip.source}:${clip.sourceId}`;

      if (seen.keys.has(key)) continue;
      if (seen.urls.has(clip.mp4Url)) continue;

      const filePath = path.join(OUT_DIR, `${id}.mp4`);
      const ok = await downloadClip(clip.mp4Url, filePath);
      if (!ok) continue;

      const record = {
        id,
        localUrl: `/native-fyp/real/${id}.mp4`,
        downloadedAt: new Date().toISOString(),
        contentMode: "real-life",
        ...clip,
      };

      manifest.push(record);
      additions.push(record);
      seen.keys.add(key);
      seen.urls.add(clip.mp4Url);
      perQuery.set(query, (perQuery.get(query) || 0) + 1);

      console.log(`✓ real-life ${id}: ${clip.source} | ${query} | ${clip.duration}s`);

      id++;

      if (additions.length >= 180) break;
    }

    if (additions.length >= 180) break;
  }

  if (additions.length >= 180) break;
}

writeManifest(manifest);

const querySpread = new Set(additions.map((x) => x.query)).size;
const sourceSpread = new Set(additions.map((x) => x.source)).size;
const humanCount = additions.filter((x) => x.humanBiased).length;
const preferredDurationCount = additions.filter((x) => x.preferredDuration).length;

console.log(`REAL_LIFE_ADDED=${additions.length}`);
console.log(`REAL_LIFE_TOTAL=${manifest.length}`);
console.log(`REAL_LIFE_QUERY_SPREAD=${querySpread}`);
console.log(`REAL_LIFE_SOURCE_SPREAD=${sourceSpread}`);
console.log(`REAL_LIFE_HUMAN_BIASED=${humanCount}`);
console.log(`REAL_LIFE_PREFERRED_DURATION=${preferredDurationCount}`);

if (additions.length < 40) {
  throw new Error(`REAL_LIFE_INGEST_TOO_LOW_${additions.length}`);
}

if (querySpread < 6) {
  throw new Error(`REAL_LIFE_QUERY_SPREAD_TOO_LOW_${querySpread}`);
}
