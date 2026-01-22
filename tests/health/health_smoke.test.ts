import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { BASE, withHealthServer } from "./helpers/healthTestUtils";

// LUMORA_HEALTH_SMOKE_BOOTSTRAP_V2
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import net from "node:net";

const __LUMORA_BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
let __child: ChildProcessWithoutNullStreams | null = null;
let __booted = false;
let __bootPort: number | null = null;

function __sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function __getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      srv.close(() => {
        if (addr && typeof addr === "object") resolve(addr.port);
        else reject(new Error("free_port_failed"));
      });
    });
  });
}

async function __probeHealth(base: string, timeoutMs = 1500): Promise<boolean> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error(`abort:${timeoutMs}ms`)), timeoutMs);
  try {
    const res = await fetch(new URL("/api/health", base), { cache: "no-store", signal: ac.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function __ensureServerReady(): Promise<string> {
  if (await __probeHealth(__LUMORA_BASE)) return __LUMORA_BASE;

  __bootPort = await __getFreePort();
  const bootBase = `http://127.0.0.1:${__bootPort}`;
  if (await __probeHealth(bootBase)) return bootBase;

  const env = { ...process.env, PORT: String(__bootPort) };
  __child = spawn("npx", ["next", "dev"], { env, stdio: ["ignore", "pipe", "pipe"], cwd: process.cwd() });
  __booted = true;

  __child.stdout.on("data", () => void 0);
  __child.stderr.on("data", () => void 0);

  const maxWaitMs = 120_000;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (await __probeHealth(bootBase, 2000)) return bootBase;
    await __sleep(500);
  }
  throw new Error(`next_dev_boot_timeout:${bootBase}`);
}

afterAll(async () => {
  if (__booted && __child) {
    try { __child.kill("SIGTERM"); await __sleep(500); __child.kill("SIGKILL"); } catch {}
    __child = null;
  }
});

const PORT = Number(process.env.PORT ?? 8088);
const BASE = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000");

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function getJson(path: string, timeoutMs: number): Promise<{ status: number; ct: string; text: string; json: any }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error(`abort:${timeoutMs}ms`)), timeoutMs);
  try {
    const res = await fetch(new URL(path, BASE), { cache: "no-store", signal: ac.signal });
    const ct = res.headers.get("content-type") ?? "";
    const text = await res.text();
    const json = ct.includes("application/json") ? JSON.parse(text) : null;
    return { status: res.status, ct, text, json };
  } finally {
    clearTimeout(t);
  }
}

async function retry<T>(fn: () => Promise<T>, totalMs: number): Promise<T> {
  const start = Date.now();
  let attempt = 0;
  let lastErr: unknown = null;

  while (Date.now() - start < totalMs) {
    attempt++;
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      // exponential backoff with cap; add tiny jitter
      const backoff = Math.min(1200, 120 * Math.pow(1.6, attempt));
      await sleep(backoff + Math.floor(Math.random() * 120));
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? "retry-timeout")));
}

withHealthServer();

describe("health smoke", () => {

  let BASE = __LUMORA_BASE;
    });

  it(
    "/api/health responds and is json (smoke, robust)",
    async () => {
      // allow up to 25s total due to dev-server cold paths / busy CPU
      const out = await retry(
        async () => {
          const r = await getJson("/api/health", 6000);
          if (r.status !== 200) throw new Error(`status:${r.status}`);
          if (!r.ct.includes("application/json")) throw new Error(`ct:${r.ct}`);
          if (!r.json || r.json.ok !== true) throw new Error(`json:${r.text.slice(0, 120)}`);
          return r;
        },
        25000
      );

      expect(out.status).toBe(200);
      expect(out.ct).toContain("application/json");
      expect(out.json.ok).toBe(true);
      expect(out.json.route).toBe("/api/health");
    },
    30000
  );

  it(
    "/api/health?deep=1 does not hang",
    async () => {
      const out = await retry(
        async () => {
          const r = await getJson("/api/health?deep=1&timeout_ms=1200", 8000);
          if (r.status !== 200) throw new Error(`status:${r.status}`);
          if (!r.ct.includes("application/json")) throw new Error(`ct:${r.ct}`);
          if (!r.json || r.json.deep !== true) throw new Error(`json:${r.text.slice(0, 120)}`);
          return r;
        },
        25000
      );

      expect(out.status).toBe(200);
      expect(out.ct).toContain("application/json");
      expect(out.json.deep).toBe(true);
      expect(out.json.checks?.self_healthz).toBeTypeOf("object");
    },
    30000
  );
});
