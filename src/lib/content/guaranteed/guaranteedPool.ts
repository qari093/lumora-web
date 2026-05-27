import fs from "node:fs";

export type GuaranteedFypItem = {
  id: string;
  title: string;
  source: string;
  sourceType: string;
  playbackUrl: string;
  localUrl?: string;
  hasAudio: boolean;
  hasVoice?: boolean;
  license?: string;
  category?: string;
  sourceUrl?: string;
};

const MANIFEST = "public/native-fyp/guaranteed-meta/manifest.json";

export function readGuaranteedPool(): GuaranteedFypItem[] {
  if (!fs.existsSync(MANIFEST)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => {
      const url = item.playbackUrl || item.localUrl;
      return Boolean(url && fs.existsSync("public" + url));
    });
  } catch {
    return [];
  }
}

export function readGuaranteedAudioPool(): GuaranteedFypItem[] {
  return readGuaranteedPool().filter((item) => item.hasAudio === true);
}
