import fs from "node:fs";
import { spawnSync } from "node:child_process";

const MANIFEST = "public/native-fyp/real-meta/manifest.json";
const MAX_CLIPS = 250;
const ARCHIVE_DIR = "public/native-fyp/archive";

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return [];
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    return [];
  }
}

function writeManifest(items) {
  fs.writeFileSync(MANIFEST, JSON.stringify(items, null, 2));
}

function storageCapGuard(items) {
  if (items.length <= MAX_CLIPS) return { active: items, archived: [] };

  const sorted = [...items].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
  const archived = sorted.slice(0, sorted.length - MAX_CLIPS);
  const active = sorted.slice(sorted.length - MAX_CLIPS);

  return { active, archived };
}

function archiveOldClips(archived) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  for (const item of archived) {
    if (!item?.localUrl) continue;

    const src = `public${item.localUrl}`;
    const dest = `${ARCHIVE_DIR}/${item.id}.mp4`;

    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.renameSync(src, dest);
    }
  }
}

function runIngestion() {
  if (!process.env.PEXELS_API_KEY && !process.env.PIXABAY_API_KEY) {
    throw new Error("Missing PEXELS_API_KEY or PIXABAY_API_KEY");
  }

  const result = spawnSync("node", ["scripts/fyp94/multisource_ingest.mjs"], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`Ingestion failed with status ${result.status}`);
  }
}

runIngestion();

const manifest = readManifest();
const { active, archived } = storageCapGuard(manifest);
archiveOldClips(archived);
writeManifest(active);

console.log(`AUTO_REFRESH_ACTIVE=${active.length}`);
console.log(`AUTO_REFRESH_ARCHIVED=${archived.length}`);
console.log("AUTO_REFRESH_DONE");
