import { spawn, type ChildProcess } from "node:child_process";
import http from "node:http";

let proc: ChildProcess | null = null;
let baseUrl = "http://127.0.0.1:3000";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url: string, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          resolve();
        });
        req.on("error", reject);
      });
      return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Next test server did not become ready");
}

/**
 * PRIMARY START — this is what tests call
 */
export async function startNextTestServer(opts: {
  port?: number;
  timeoutMs?: number;
}) {
  if (proc) return;

  const port = opts.port ?? 3000;
  const timeoutMs = opts.timeoutMs ?? 90_000;

  baseUrl = `http://127.0.0.1:${port}`;
  process.env.BASE_URL = baseUrl;

  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = ["-y", "next", "dev", "-p", String(port), "-H", "127.0.0.1"];

  proc = spawn(cmd, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "test",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForServer(`${baseUrl}/api/health`, timeoutMs);
}

/**
 * PRIMARY STOP — this is what tests call
 */
export async function shutdownServer() {
  if (!proc) return;
  proc.kill("SIGTERM");
  proc = null;
}

/**
 * Backward compatibility
 */
export const stopNextTestServer = shutdownServer;

export function getNextTestBaseUrl() {
  return baseUrl;
}
