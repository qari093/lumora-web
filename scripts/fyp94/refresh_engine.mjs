import fs from "node:fs";
import { spawnSync } from "node:child_process";

const POLICY = {
  maxManifestItems: 300,
  minPlayableItems: 30,
};

const MANIFEST = "public/native-fyp/real-meta/manifest.json";
const ARCHIVE_DIR = "public/native-fyp/archive";

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return [];
  return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
}

function writeManifest(items) {
  fs.writeFileSync(MANIFEST, JSON.stringify(items, null, 2));
}

function splitArchiveWindow(items, maxItems) {
  if (items.length <= maxItems) return { active: items, archived: [] };

  const sorted = [...items].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
  return {
    archived: sorted.slice(0, sorted.length - maxItems),
    active: sorted.slice(sorted.length - maxItems),
  };
}

function archiveOldClips(archived) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  for (const item of archived) {
    if (!item.localUrl) continue;

    const src = `public${item.localUrl}`;
    const dest = `${ARCHIVE_DIR}/${item.id}.mp4`;

    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.renameSync(src, dest);
    }
  }
}

function validateFreshness(items) {
  const playable = items.filter((item) => item.localUrl && item.source && item.query);

  if (playable.length < POLICY.minPlayableItems) {
    throw new Error(`feed_not_fresh_enough_${playable.length}`);
  }

  return playable.length;
}

function runAppendIngestion() {
  const result = spawnSync("node", ["scripts/fyp94/append_paginated_pexels.mjs"], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`append_ingestion_failed_${result.status}`);
  }
}

runAppendIngestion();

const manifest = readManifest();
const { active, archived } = splitArchiveWindow(manifest, POLICY.maxManifestItems);

archiveOldClips(archived);
writeManifest(active);

const playableCount = validateFreshness(active);

fs.writeFileSync(
  ".lumora_fyp94_refresh_state.json",
  JSON.stringify(
    {
      ok: true,
      refreshedAt: new Date().toISOString(),
      activeCount: active.length,
      archivedCount: archived.length,
      playableCount,
    },
    null,
    2,
  ),
);

console.log(`FYP94_REFRESH_ACTIVE=${active.length}`);
console.log(`FYP94_REFRESH_ARCHIVED=${archived.length}`);
console.log(`FYP94_REFRESH_PLAYABLE=${playableCount}`);
console.log("FYP94_REFRESH_DONE");
