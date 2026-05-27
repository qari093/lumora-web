import fs from "node:fs";

export function readFyp94Manifest(path = "public/native-fyp/real-meta/manifest.json") {
  if (!fs.existsSync(path)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function filterFyp94PlayableManifest(items: any[]) {
  return items.filter((item) => {
    if (!item?.localUrl) return false;
    if (!item?.source) return false;
    if (!item?.query) return false;
    return true;
  });
}
