// app/api/fyp/_store.ts
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export type Clip = { id: string; title: string; url: string; createdAt: number };

const g = globalThis as unknown as { __FYP_STORE?: Clip[] };
if (!g.__FYP_STORE) g.__FYP_STORE = [];
const _clips: Clip[] = g.__FYP_STORE!;

// ---------- file helpers ----------
const VID_DIR = path.join(process.cwd(), "public", "videos");
const p = (...x: string[]) => path.join(VID_DIR, ...x);
const exists = (f: string) => { try { fs.accessSync(f); return true; } catch { return false; } };
const ensureDir = () => { fs.mkdirSync(VID_DIR, { recursive: true }); };

function ensureSeedFiles() {
  ensureDir();
  const workout = p("workout.mp4");
  const t1 = p("test-1.mp4");
  const t2 = p("test-2.mp4");

  // If you have a big workout.mp4, use it as the source for seeds
  if (exists(workout)) {
    if (!exists(t1)) fs.copyFileSync(workout, t1);
    if (!exists(t2)) fs.copyFileSync(workout, t2);
    return;
  }

  // Otherwise try to synthesize small colored MP4s with ffmpeg
  const makeColor = (file: string, color: string) => {
    try {
      execSync(
        `ffmpeg -hide_banner -loglevel error -f lavfi -t 2 -i color=c=${color}:s=640x360:r=25 ` +
        `-movflags +faststart -pix_fmt yuv420p -y "${p(file)}"`
      );
    } catch { /* ignore */ }
  };
  if (!exists(t1)) makeColor("test-1.mp4", "blue");
  if (!exists(t2)) makeColor("test-2.mp4", "green");
}

function listTestFiles(): { file: string; mtimeMs: number }[] {
  ensureDir();
  return fs.readdirSync(VID_DIR)
    .filter(f => /^test-\d+\.mp4$/.test(f))
    .map(file => ({ file, mtimeMs: fs.statSync(p(file)).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

// ---------- public API ----------
export function ensureSeed(): void {
  ensureSeedFiles();
  if (_clips.length === 0) {
    _clips.push({
      id: "seed-1",
      title: "Blue Placeholder",
      url: "/videos/test-1.mp4",
      createdAt: Date.now(),
    });
  }
}

export function all(): Clip[] {
  ensureSeed();
  return _clips.slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function addGenerated(): Clip {
  ensureSeed();        // keep memory seed
  ensureSeedFiles();   // ensure test-1.mp4/test-2.mp4 exist

  // Find the next test-N number by scanning files
  const nums = listTestFiles()
    .map(x => x.file.match(/^test-(\d+)\.mp4$/)?.[1])
    .map(s => (s ? parseInt(s, 10) : NaN))
    .filter(n => Number.isFinite(n)) as number[];

  const nextIdx  = (nums.length ? Math.max(...nums) : 2) + 1;
  const fileName = `test-${nextIdx}.mp4`;
  const outPath  = p(fileName);
  const title    = "AI " + new Date().toLocaleTimeString();

  // Try to generate a new small colored MP4; if ffmpeg fails, copy an existing seed
  try {
    const palette = ["red","orange","yellow","green","cyan","blue","purple","pink","lime","gray"];
    const color   = palette[Math.floor(Math.random()*palette.length)] || "gray";
    execSync(
      `ffmpeg -hide_banner -loglevel error -f lavfi -t 3 -i color=c=${color}:s=640x360:r=25 ` +
      `-movflags +faststart -pix_fmt yuv420p -y "${outPath}"`
    );
    if (fs.statSync(outPath).size < 4_000) throw new Error("ffmpeg produced tiny file");
  } catch {
    const fallback = exists(p("test-2.mp4")) ? p("test-2.mp4") : p("test-1.mp4");
    fs.copyFileSync(fallback, outPath);
  }

  const createdAt = Math.floor(fs.statSync(outPath).mtimeMs);
  const clip: Clip = { id: path.basename(fileName, ".mp4"), title, url: "/videos/" + fileName, createdAt };

  _clips.unshift(clip); // make it the newest in-memory item for /api/fyp/recommend
  return clip;
}

export function page(opts: { limit: number; cursor?: number | null }): { items: Clip[]; nextCursor: number | null } {
  const sorted = all();
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