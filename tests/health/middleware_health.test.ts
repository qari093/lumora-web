import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { BASE, withHealthServer } from "./helpers/healthTestUtils";

// LUMORA_HEALTH_TEST_BOOTSTRAP_V2
// END LUMORA_TEST_NEXT_DEV_BOOTSTRAP
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import net from "node:net";

const __LUMORA_BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

let __child: ChildProcessWithoutNullStreams | null = null;
let __booted = false;
let __bootPort: number | null = null;

function __sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
    try {
      __child.kill("SIGTERM");
      await __sleep(500);
      __child.kill("SIGKILL");
    } catch {
      // ignore
    } finally {
      __child = null;
    }
  }
});



import { describe, it, expect } from "vitest";

withHealthServer();

describe("health middleware rewrite — minimal suite guard (auto)", () => {
  const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
  it("/api/health returns JSON ok (minimal)", async () => {
    const res = await fetch(new URL("/api/health", BASE), { cache: "no-store" });
    expect(res.ok).toBe(true);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct.toLowerCase()).toContain("application/json");
    const j = await res.json();
    expect(j).toBeTruthy();
  });
});
