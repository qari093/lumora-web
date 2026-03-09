import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const PERSONA_DIR = path.join(ROOT, "public", "persona");
const AVATAR_DIR = path.join(PERSONA_DIR, "avatars");
const EMOJI_DIR = path.join(PERSONA_DIR, "emojis");
const OUT = path.join(PERSONA_DIR, "manifest.json");

type Entry = {
  path: string;
  bytes: number;
  sha256: string;
  mtimeMs: number;
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function allowed(file: string): boolean {
  return /\.(svg|png|webp)$/i.test(file);
}

function toEntry(full: string): Entry {
  const buf = fs.readFileSync(full);
  const st = fs.statSync(full);
  return {
    path: "/" + path.relative(path.join(ROOT, "public"), full).replace(/\\/g, "/"),
    bytes: st.size,
    sha256: crypto.createHash("sha256").update(buf).digest("hex"),
    mtimeMs: st.mtimeMs
  };
}

const avatarFiles = walk(AVATAR_DIR).filter(allowed).sort();
const emojiFiles = walk(EMOJI_DIR).filter(allowed).sort();
const entries = [...avatarFiles, ...emojiFiles].map(toEntry);

const counts = {
  total: entries.length,
  avatarsNeutral: avatarFiles.filter((p) => /\/neutral\//.test(p)).length,
  avatarsVariants: avatarFiles.length,
  emojis: emojiFiles.length
};

const manifest = {
  ok: true,
  generatedAt: new Date().toISOString(),
  counts,
  entries
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`rebuilt manifest: ${OUT}`);
console.log(JSON.stringify(counts, null, 2));
