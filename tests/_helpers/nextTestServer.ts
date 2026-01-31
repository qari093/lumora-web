import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, createWriteStream } from "node:fs";
import { resolve } from "node:path";

function __withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout:${label}:${ms}ms`)), ms);
    p.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}



type StartOpts = {
  port?: number;
  timeoutMs?: number;
  quiet?: boolean;
  outDir?: string;
};

let child: ChildProcess | null = null;
let starting: Promise<void> | null = null;
let startedPort = 3000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitFor(url: string, timeoutMs: number) {
  const started = Date.now();
  let lastErr = "unknown";
  while (Date.now() - started < timeoutMs) {
    try {
      try {
        const res = await __withTimeout(fetch(url, { cache: "no-store"as any }), timeoutMs, "fetch");
        if (res.ok) return;
        lastErr = `http:${res.status}`;
      } finally {

      }
    } catch (e: any) {
      lastErr = (e && e.message) ? String(e.message) : "fetch_failed";
    }
    await sleep(250);
  }
  throw new Error(`nextTestServer: not healthy within ${timeoutMs}ms (last=${lastErr})`);
}

function pickCommand() {
  // Prefer pnpm when lockfile present
  const usePnpm = existsSync("pnpm-lock.yaml");
  if (usePnpm) return { cmd: "pnpm", argsPrefix: ["-s"] as string[] };
  return { cmd: "npx", argsPrefix: ["--yes"] as string[] };
}

export async function startNextTestServer(opts: StartOpts = {}) {
  if (child && child.exitCode === null) return;
  if (starting) return starting;

  const port = Number.isFinite(opts.port) ? (opts.port as number) : (Number(process.env.PORT) || 3000);
  const timeoutMs = Number.isFinite(opts.timeoutMs) ? (opts.timeoutMs as number) : 90000;
  const outDir = opts.outDir || process.env.LUMORA_NEXT_LOG_DIR || "docs/launch/ci-step031i/next-boot-fix";
  startedPort = port;

  const base = `http://127.0.0.1:${port}`;
  const logOutPath = resolve(outDir, "next_test_server.out.log");
  const logErrPath = resolve(outDir, "next_test_server.err.log");

  const { cmd, argsPrefix } = pickCommand();

  // Prefer "next start" if a build exists, else fallback to dev.
  const hasBuild = existsSync(".next/BUILD_ID");
  const args = hasBuild
    ? [...argsPrefix, "next", "start", "-p", String(port), "-H", "127.0.0.1"]
    : (cmd === "pnpm"
        ? [...argsPrefix, "dev", "-p", String(port)]
        : [...argsPrefix, "next", "dev", "-p", String(port), "-H", "127.0.0.1"]);

  starting = new Promise<void>((resolveP, rejectP) => {
    const stdout = createWriteStream(logOutPath, { flags: "a" });
    const stderr = createWriteStream(logErrPath, { flags: "a" });

    child = spawn(cmd, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        PORT: String(port),
        HOSTNAME: "127.0.0.1",
        NEXT_TELEMETRY_DISABLED: "1",
        CI: "1",
        NODE_ENV: hasBuild ? "production" : "development",
      },
    });

    child.stdout?.pipe(stdout);
    child.stderr?.pipe(stderr);

    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      if (code !== null && code !== 0) {
        rejectP(new Error(`nextTestServer exited code=${code} signal=${signal ?? "none"} logs=${logErrPath}`));
      }
    };

    child.on("error", (e) => rejectP(e));
    child.on("exit", onExit);

    (async () => {
      try {
        await waitFor(`${base}/api/health`, timeoutMs);
        resolveP();
      } catch (e: any) {
        try { child?.kill("SIGTERM"); } catch {}
        rejectP(e);
      } finally {
        starting = null;
      }
    })();
  });

  return starting;
}

export async function stopNextTestServer() {
  starting = null;
  if (!child) return;
  const p = child;
  child = null;

  try { p.kill("SIGTERM"); } catch {}
  for (let i = 0; i < 25; i++) {
    if (p.exitCode !== null) return;
    await sleep(200);
  }
  try { p.kill("SIGKILL"); } catch {}
}

export function getNextTestBaseUrl() {
  const port = Number(process.env.PORT) || startedPort || 3000;
  const envBase = process.env.BASE_URL;
  if (envBase && envBase !== "/") return envBase;
  return `http://127.0.0.1:${port}`;
}
