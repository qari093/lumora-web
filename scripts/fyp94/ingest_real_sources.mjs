import fs from "node:fs/promises";

const OUT = "public/native-fyp/real";
const META = "public/native-fyp/real-meta/manifest.json";
await fs.mkdir(OUT, { recursive: true });
await fs.mkdir("public/native-fyp/real-meta", { recursive: true });

const queries = ["parkour", "surf", "skateboard", "bike stunt", "drift", "speed", "adrenaline", "extreme sports"];
const clips = [];

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 80_000) return false;
  await fs.writeFile(file, buf);
  return true;
}

async function pexels(query) {
  if (!process.env.PEXELS_API_KEY) return [];
  const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=10`, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.videos ?? []).map(v => {
    const file = [...(v.video_files ?? [])]
      .filter(f => f.file_type === "video/mp4")
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
    return file ? {
      source: "pexels",
      sourceUrl: v.url,
      title: `Pexels ${query}`,
      mp4Url: file.link,
      width: file.width,
      height: file.height,
      duration: v.duration,
      license: "pexels",
    } : null;
  }).filter(Boolean);
}

async function pixabay(query) {
  if (!process.env.PIXABAY_API_KEY) return [];
  const res = await fetch(`https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=10&safesearch=true`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.hits ?? []).map(v => {
    const f = v.videos?.medium || v.videos?.small || v.videos?.large;
    return f?.url ? {
      source: "pixabay",
      sourceUrl: v.pageURL,
      title: `Pixabay ${query}`,
      mp4Url: f.url,
      width: f.width,
      height: f.height,
      duration: v.duration ?? 10,
      license: "pixabay",
    } : null;
  }).filter(Boolean);
}

for (const q of queries) {
  clips.push(...await pexels(q));
  clips.push(...await pixabay(q));
}

const seen = new Set();
const unique = clips
  .filter(c => c.mp4Url && c.height >= c.width)
  .filter(c => {
    if (seen.has(c.mp4Url)) return false;
    seen.add(c.mp4Url);
    return true;
  })
  .slice(0, 20);

if (unique.length < 8) {
  throw new Error(`Only ${unique.length} unique vertical videos found. Need better API key/source response.`);
}

const manifest = [];

let i = 1;
for (const clip of unique) {
  const ok = await download(clip.mp4Url, `${OUT}/${i}.mp4`);
  if (!ok) continue;
  manifest.push({ id: i, ...clip, localUrl: `/native-fyp/real/${i}.mp4` });
  console.log(`✓ real video ${i}: ${clip.source} ${clip.title}`);
  i++;
}

await fs.writeFile(META, JSON.stringify(manifest, null, 2));

if (manifest.length < 8) throw new Error(`Downloaded only ${manifest.length} videos`);

console.log("REAL_SOURCE_INGESTION_DONE");
