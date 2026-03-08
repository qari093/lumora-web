import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const AVATAR_DIR = "public/persona/avatars";
const EMOJI_DIR = "public/persona/emojis";
const OUT_DIR = "public/persona/sprites";
const BAD_LIST = path.join(OUT_DIR, "bad_files.json");

type Item = { file: string; width: number; height: number; data: Buffer };
type Report = {
  avatars: { total: number; valid: number; invalid: number; files: string[] };
  emojis: { total: number; valid: number; invalid: number; files: string[] };
};

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else if (entry.isFile() && full.toLowerCase().endsWith(".png")) out.push(full);
  }
  return out.sort();
}

function tryReadPng(file: string): Item | null {
  try {
    const buf = fs.readFileSync(file);
    const png = PNG.sync.read(buf);
    if (!png?.width || !png?.height || !png?.data?.length) return null;
    return { file, width: png.width, height: png.height, data: png.data };
  } catch {
    return null;
  }
}

function buildAtlas(files: string[], name: string, invalidSink: string[]): boolean {
  const valid: Item[] = [];
  for (const file of files) {
    const parsed = tryReadPng(file);
    if (parsed) valid.push(parsed);
    else invalidSink.push(file);
  }

  if (valid.length === 0) return false;

  const cellW = Math.max(...valid.map((v) => v.width));
  const cellH = Math.max(...valid.map((v) => v.height));
  const cols = Math.min(16, Math.max(1, Math.ceil(Math.sqrt(valid.length))));
  const rows = Math.ceil(valid.length / cols);

  const atlas = new PNG({ width: cols * cellW, height: rows * cellH, filterType: 4 });
  atlas.data.fill(0);

  const index: Record<string, { x: number; y: number; w: number; h: number }> = {};

  valid.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const dx = col * cellW;
    const dy = row * cellH;

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const src = (img.width * y + x) << 2;
        const dst = (atlas.width * (dy + y) + (dx + x)) << 2;
        atlas.data[dst] = img.data[src];
        atlas.data[dst + 1] = img.data[src + 1];
        atlas.data[dst + 2] = img.data[src + 2];
        atlas.data[dst + 3] = img.data[src + 3];
      }
    }

    index[img.file.replace(/^public\//, "")] = { x: dx, y: dy, w: img.width, h: img.height };
  });

  fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), PNG.sync.write(atlas));
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(index, null, 2));
  return true;
}

function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const avatars = fs.existsSync(AVATAR_DIR) ? collectFiles(AVATAR_DIR) : [];
  const emojis = fs.existsSync(EMOJI_DIR) ? collectFiles(EMOJI_DIR) : [];

  const badAvatars: string[] = [];
  const badEmojis: string[] = [];

  const avatarsBuilt = buildAtlas(avatars, "avatars_atlas", badAvatars);
  const emojisBuilt = buildAtlas(emojis, "emoji_atlas", badEmojis);

  const report: Report = {
    avatars: {
      total: avatars.length,
      valid: avatars.length - badAvatars.length,
      invalid: badAvatars.length,
      files: badAvatars,
    },
    emojis: {
      total: emojis.length,
      valid: emojis.length - badEmojis.length,
      invalid: badEmojis.length,
      files: badEmojis,
    },
  };

  fs.writeFileSync(BAD_LIST, JSON.stringify(report, null, 2));

  console.log("=== atlas build summary ===");
  console.log(JSON.stringify({ avatarsBuilt, emojisBuilt, report }, null, 2));
  console.log("Step 11 — done");
}

run();
