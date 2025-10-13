import fs from "fs";
import path from "path";

export type Clip = { id: string; title: string; url: string; createdAt: number };

const g = globalThis as unknown as { __FYP_STORE?: Clip[] };
if (!g.__FYP_STORE) g.__FYP_STORE = [];
const _clips: Clip[] = g.__FYP_STORE!;

const VID_DIR = path.join(process.cwd(), "public", "videos");
const seed1 = path.join(VID_DIR, "test-1.mp4");

function ensureDir() {
  if (!fs.existsSync(VID_DIR)) fs.mkdirSync(VID_DIR, { recursive: true });
}

function sizeOk(p: string, min = 10_000) {
  try { return fs.statSync(p).size >= min; } catch { return false; }
}

export function ensureSeed(): void {
  ensureDir();
  if (!sizeOk(seed1)) {
    // make sure at least one dummy seed exists
    fs.writeFileSync(seed1, Buffer.alloc(100_000));
  }
  if (_clips.length === 0) {
    _clips.push({ id: "seed-1", title: "Seed Clip", url: "/videos/test-1.mp4", createdAt: Date.now() });
  }
}

export function addGenerated(customTitle?: string): Clip {
  ensureSeed();

  const id = "gen-" + Date.now();
  const fileName = `${id}.mp4`; // ✅ THIS was missing earlier
  const outPath = path.join(VID_DIR, fileName);

  try {
    fs.copyFileSync(seed1, outPath);
  } catch {
    fs.writeFileSync(outPath, Buffer.alloc(50_000));
  }

  const title = customTitle || "AI Generated " + new Date().toLocaleTimeString();
  const createdAt = Math.floor(fs.statSync(outPath).mtimeMs);
  const clip: Clip = { id, title, url: "/videos/" + fileName, createdAt };
  _clips.unshift(clip);
  return clip;
}

export function page(opts: { limit: number; cursor?: number | null }): { items: Clip[]; nextCursor: number | null } {
  const sorted = _clips.slice().sort((a, b) => b.createdAt - a.createdAt);
  let start = 0;
  if (opts.cursor) {
    const i = sorted.findIndex(c => c.createdAt < (opts.cursor as number));
    start = i < 0 ? sorted.length : i;
  }
  const lim = Math.max(1, Number.isFinite(opts.limit) ? opts.limit : 10);
  const items = sorted.slice(start, start + lim);
  const last = items[items.length - 1];
  const more = last ? sorted.some(c => c.createdAt < last.createdAt) : false;
  return { items, nextCursor: more && last ? last.createdAt : null };
}