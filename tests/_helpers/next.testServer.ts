import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";

export type NextServerHandle = {
  port: number;
  baseUrl: string;
  pid: number;
  stop: () => Promise<void>;
};

type Mode = "start" | "dev";

type StartOpts = {
  port: number;
  mode: Mode;
  quiet?: boolean;
  env?: Record<string, string | undefined>;
  waitMs?: number;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function isPortOpen(port: number, host = "127.0.0.1"): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function waitForHttpOk(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  // Lazy import fetch for Node 20 (global fetch exists, but keep safe)
  const f = (globalThis as any).fetch as typeof fetch | undefined;

  while (Date.now() - start < timeoutMs) {
    try {
      if (!(await isPortOpen(new URL(url).port ? Number(new URL(url).port) : 80))) {
        await sleep(200);
        continue;
      }
      const res = f
        ? await f(url, { method: "GET", headers: { "accept": "application/json" } })
        : await import("node:http").then(({ request }) => new Promise<Response>((resolve, reject) => {
            const u = new URL(url);
            const req = request(
              { hostname: u.hostname, port: Number(u.port), path: u.pathname + u.search, method: "GET" },
              (r) => {
                // @ts-ignore minimal response shim
                resolve({ ok: (r.statusCode || 0) >= 200 && (r.statusCode || 0) < 300, status: r.statusCode || 0 } as any);
              }
            );
            req.on("error", reject);
            req.end();
          }));

      if ((res as any).ok) return;
    } catch {
      // ignore
    }
    await sleep(250);
  }
  throw new Error(`wait_for_http_timeout: ${url}`);
}

function spawnNext(opts: StartOpts): ChildProcess {
  const env = { ...process.env, ...(opts.env || {}) };

  // Use npx to avoid "zsh: command not found: next"
  const args =
    opts.mode === "dev"
      ? ["-y", "next", "dev", "-p", String(opts.port)]
      : ["-y", "next", "start", "-p", String(opts.port)];

  const cp = spawn("npx", args, {
    env,
    stdio: opts.quiet ? "ignore" : "inherit",
    cwd: process.cwd(),
  });

  return cp;
}

async function killTree(cp: ChildProcess): Promise<void> {
  if (!cp.pid) return;

  const pid = cp.pid;
  // Best effort; macOS/Linux both accept SIGTERM/SIGKILL
  try {
    cp.kill("SIGTERM");
  } catch {
    // ignore
  }

  const start = Date.now();
  while (Date.now() - start < 8000) {
    if (cp.exitCode !== null) return;
    await sleep(100);
  }

  try {
    cp.kill("SIGKILL");
  } catch {
    // ignore
  }

  const start2 = Date.now();
  while (Date.now() - start2 < 2000) {
    if (cp.exitCode !== null) return;
    await sleep(100);
  }

  // Final fallback: try pkill on pid
  try {
    spawn("sh", ["-lc", `kill -9 ${pid} >/dev/null 2>&1 || true`], { stdio: "ignore" });
  } catch {
    // ignore
  }
}

export async function startNextTestServer(opts: StartOpts): Promise<NextServerHandle> {
  const port = opts.port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const cp = spawnNext({ ...opts, port });
  if (!cp.pid) throw new Error("next_spawn_failed_no_pid");

  // If process exits early, surface quickly
  const earlyExit = new Promise<void>((_, rej) => {
    cp.once("exit", (code, signal) => {
      rej(new Error(`next_exited_early code=${code} signal=${signal}`));
    });
  });

  const wait = (async () => {
    const waitMs = typeof opts.waitMs === "number" ? opts.waitMs : 120000;
    // Prefer /api/health because that's what tests need
    await waitForHttpOk(`${baseUrl}/api/health`, waitMs);
  })();

  await Promise.race([wait, earlyExit]);

  return {
    port,
    baseUrl,
    pid: cp.pid,
    stop: async () => {
      await killTree(cp);
    },
  };
}
