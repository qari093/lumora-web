import { NextRequest } from "next/server";

type CapState = {
  day: string; // YYYY-MM-DD (UTC)
  count: number;
};

function isPrivateLaunch(): boolean {
  const launchMode = (process.env.LAUNCH_MODE || process.env.LUMORA_LAUNCH_MODE || "").toLowerCase();
  const publicAccess = (process.env.PUBLIC_ACCESS || process.env.LUMORA_PUBLIC_ACCESS || "").trim();
  return launchMode === "private" || publicAccess === "0";
}

function capValue(): number {
  const raw = (process.env.LUMORA_VIDEO_GEN_DAILY_CAP || "").trim();
  const n = Number(raw || "300");
  if (!Number.isFinite(n) || n <= 0) return 300;
  return Math.floor(n);
}

function utcDay(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function stateFilePath(): string {
  // keep out of repo root caches; stable across runs
  return `${process.cwd()}/ops/_limits/video_gen_cap_state.json`;
}

function lockDirPath(): string {
  return `${process.cwd()}/ops/_limits/.video_gen_cap_lock`;
}

// minimal sleep
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// best-effort exclusive lock via mkdir (POSIX-ish, OK for single host)
async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const lockDir = lockDirPath();
  for (let i = 0; i < 50; i++) {
    try {
      // eslint-disable-next-line no-undef
      require("fs").mkdirSync(lockDir);
      break;
    } catch {
      await sleep(20);
    }
  }
  try {
    return await fn();
  } finally {
    try {
      // eslint-disable-next-line no-undef
      require("fs").rmdirSync(lockDir);
    } catch {}
  }
}

function readState(): CapState {
  const p = stateFilePath();
  try {
    // eslint-disable-next-line no-undef
    const fs = require("fs");
    if (!fs.existsSync(p)) return { day: utcDay(), count: 0 };
    const raw = String(fs.readFileSync(p, "utf8") || "").trim();
    const j = JSON.parse(raw);
    const day = typeof j?.day === "string" ? j.day : utcDay();
    const count = typeof j?.count === "number" && Number.isFinite(j.count) ? j.count : 0;
    return { day, count };
  } catch {
    return { day: utcDay(), count: 0 };
  }
}

function writeState(s: CapState) {
  const p = stateFilePath();
  try {
    // eslint-disable-next-line no-undef
    const fs = require("fs");
    fs.mkdirSync(`${process.cwd()}/ops/_limits`, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(s, null, 2) + "\n", "utf8");
  } catch {}
}

export type VideoGenCapDecision =
  | { ok: true; remaining: number; cap: number; day: string }
  | { ok: false; remaining: 0; cap: number; day: string; retryAfterSec: number };

export async function enforceVideoGenDailyCap(req: NextRequest): Promise<VideoGenCapDecision> {
  if (!isPrivateLaunch()) {
    // no cap in non-private modes
    return { ok: true, remaining: Number.MAX_SAFE_INTEGER, cap: Number.MAX_SAFE_INTEGER, day: utcDay() };
  }

  const cap = capValue();
  const day = utcDay();

  return await withLock(async () => {
    const cur = readState();
    const normalized: CapState = cur.day === day ? cur : { day, count: 0 };
    if (normalized.count >= cap) {
      // retry after next UTC day boundary
      const now = new Date();
      const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0);
      const retryAfterSec = Math.max(60, Math.floor((next - now.getTime()) / 1000));
      return { ok: false, remaining: 0, cap, day, retryAfterSec };
    }

    normalized.count += 1;
    writeState(normalized);
    const remaining = Math.max(0, cap - normalized.count);
    return { ok: true, remaining, cap, day };
  });
}
