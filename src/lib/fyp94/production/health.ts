import fs from "node:fs";

export function getFyp94FeedHealth() {
  const manifestPath = "public/native-fyp/real-meta/manifest.json";
  const exists = fs.existsSync(manifestPath);

  const manifest = exists
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : [];

  const playable = manifest.filter((item: any) => {
    if (!item.localUrl) return false;
    return fs.existsSync(`public${item.localUrl}`);
  });

  return {
    ok: playable.length > 0,
    manifestCount: manifest.length,
    playableCount: playable.length,
    storageMode: process.env.FYP94_STORAGE_MODE || "local",
    cdnConfigured: Boolean(process.env.FYP94_CDN_BASE_URL),
  };
}
