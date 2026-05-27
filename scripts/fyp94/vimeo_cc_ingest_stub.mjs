import fs from "node:fs";
import { normalizeFyp94VimeoCandidate, validateFyp94VimeoCandidate } from "../../src/lib/fyp94/vimeo/gate.ts";

const MANIFEST = "public/native-fyp/real-meta/manifest.json";

export function mergeVimeoCandidatesIntoManifest(candidates) {
  const existing = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
    : [];

  const seen = new Set(existing.map((item) => `${item.source}:${item.sourceId || item.id}`));
  const accepted = [];

  for (const candidate of candidates) {
    const validation = validateFyp94VimeoCandidate(candidate);
    if (!validation.ok) continue;

    const normalized = normalizeFyp94VimeoCandidate(candidate);
    const key = `${normalized.source}:${normalized.sourceId}`;
    if (seen.has(key)) continue;

    accepted.push({
      id: existing.length + accepted.length + 1,
      localUrl: "",
      downloadedAt: new Date().toISOString(),
      ...normalized,
    });

    seen.add(key);
  }

  const merged = [...existing, ...accepted];
  fs.writeFileSync(MANIFEST, JSON.stringify(merged, null, 2));

  return {
    accepted: accepted.length,
    total: merged.length,
  };
}

console.log("VIMEO_CC_STRICT_GATE_READY");
