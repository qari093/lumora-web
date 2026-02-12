import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const PID_FILE = path.join(ROOT, ".vitest_next_pid");
const LOG_FILE = path.join(ROOT, ".vitest_next_log");

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPid(): number | null {
  try {
    if (!fs.existsSync(PID_FILE)) return null;
    const s = fs.readFileSync(PID_FILE, "utf8").trim();
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

async function isPortFree(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.listen(port, host, () => srv.close(() => resolve(true)));
  });
}

async function findFreePort(host: string, startPort: number, maxTries = 40): Promise<number> {
  for (let i = 0; i < maxTries; i++) {
    const p = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(host, p);
    if (free) return p;
  }
  throw new Error(`no_free_port_from_${startPort}`);
}

async function waitFor(url: string, ms = 30000) {
  if (typeof fetch !== "function") {
    throw new Error("global_fetch_unavailable: run Node 18+ (prefer Node 20)");
  }
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
      if (r.ok) return;
    } catch {}
    await sleep(300);
  }
  throw new Error(`timeout_waiting_for_http ${url}`);
}

function tailLog(n = 160): string {
  try {
    if (!fs.existsSync(LOG_FILE)) return "(no .vitest_next_log)";
    const s = fs.readFileSync(LOG_FILE, "utf8");
    const lines = s.split(/\r?\n/);
    return lines.slice(Math.max(0, lines.length - n)).join("\n");
  } catch (e: any) {
    return `tail_failed: ${String(e?.message || e)}`;
  }
}

export default async function globalSetup() {
  const HOST = process.env.TEST_HOST || "127.0.0.1";
  const START_PORT = Number(process.env.TEST_PORT || "4174");
  const PORT = await findFreePort(HOST, START_PORT, 40);
  const BASE = `http://${HOST}:${PORT}`;

  const e = process.env as Record<string, string | undefined>;
  e.TEST_HOST = HOST;
  e.TEST_PORT = String(PORT);
  e.NEXT_PUBLIC_SITE_URL = BASE;
  e.NEXT_PUBLIC_WEB_URL = BASE;
  e.APP_URL = BASE;
  e.SITE_URL = BASE;
  e.BASE_URL = BASE;
  e.LUMORA_BASE_URL = BASE;

  // Reuse existing server if alive & healthy
  const existing = readPid();
  if (existing && pidAlive(existing)) {
    try {
      await waitFor(`${BASE}/api/healthz`, 15000);
      return async () => {};
    } catch {
      // fallthrough to spawn
    }
  }

  // Clear stale pid file
  try { if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE); } catch {}

  // Reset log file
  try { fs.writeFileSync(LOG_FILE, "", "utf8"); } catch {}

  // Prefer pnpm if available (more reliable than npx in some setups)
  const usePnpm = (() => {
    try {
      const p = spawn(process.platform === "win32" ? "where" : "command", process.platform === "win32" ? ["pnpm"] : ["-v", "pnpm"]);
      p.kill();
      return true;
    } catch {
      return false;
    }
  })();

  const cmd = usePnpm ? (process.platform === "win32" ? "pnpm.cmd" : "pnpm") : (process.platform === "win32" ? "npx.cmd" : "npx");
  const args = usePnpm
    ? ["-s", "next", "dev", "-p", String(PORT), "-H", HOST]
    : ["next", "dev", "-p", String(PORT), "-H", HOST];

  const child = spawn(cmd, args, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "test" },
  });

  fs.writeFileSync(PID_FILE, String(child.pid), "utf8");

  const out = fs.createWriteStream(LOG_FILE, { flags: "a" });
  child.stdout.pipe(out);
  child.stderr.pipe(out);

  try {
    await waitFor(`${BASE}/api/healthz`, 45000);
  } catch (err: any) {
    const logTail = tailLog(220);
    throw new Error(`${String(err?.message || err)}\n\n---- .vitest_next_log (tail) ----\n${logTail}\n---- end ----`);
  }

  return async () => {
    try {
      process.kill(child.pid);
    } catch {}
    try { if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE); } catch {}
  };
}
