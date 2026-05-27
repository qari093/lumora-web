import fs from "node:fs";
import {
  getFyp94StorageMode,
  validateFyp94ProductionConfig,
} from "./config";

export function readFyp94ProductionManifest(path = "public/native-fyp/real-meta/manifest.json") {
  if (!fs.existsSync(path)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getFyp94ProductionHealth() {
  const manifest = readFyp94ProductionManifest();

  const playable = manifest.filter((item: any) => {
    if (!item.localUrl) return false;
    if (getFyp94StorageMode() === "r2") return true;
    return fs.existsSync(`public${item.localUrl}`);
  });

  const config = validateFyp94ProductionConfig();

  return {
    ok: config.ok && playable.length >= 30,
    storageMode: config.storageMode,
    cdnConfigured: config.cdnConfigured,
    fallbackLocal: config.fallbackLocal,
    manifestCount: manifest.length,
    playableCount: playable.length,
  };
}
