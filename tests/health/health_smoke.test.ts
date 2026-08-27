import { describe, it, expect } from "vitest";

import { spawn } from "child_process";

const PORT = 4173;
const __BASE_INTERNAL = "http://127.0.0.1:" + PORT;

let child: any = null;

async function waitFor(url: string, ms = 60000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(url, { headers: { accept: "application/json" } });
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

beforeAll(async () => {
  process.env.LUMORA_BASE_URL = __BASE_INTERNAL;
  const usePnpm = !!process.env.npm_config_user_agent?.includes("pnpm");
  const cmd = usePnpm ? "pnpm" : "npx";
  const args = usePnpm ? ["-s", "next", "dev", "-p", String(PORT), "-H", "127.0.0.1"] : ["-y", "next", "dev", "-p", String(PORT), "-H", "127.0.0.1"];
  child = spawn(cmd, args, { stdio: "ignore", env: { ...process.env, NODE_ENV: "test" } });
  const ok = await waitFor(`${BASE}/api/health`, 60000);
  if (!ok) throw new Error("health smoke: server did not become ready");
});

afterAll(async () => {
  if (child && !child.killed) {
    try { child.kill("SIGTERM"); } catch {}
  }
});

const BASE: string = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

function baseUrl(): string {
  const u = process.env.LUMORA_TEST_BASE_URL;
  return u && typeof u === "string" ? u : `${BASE}`;
}

async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetries(url: string, tries: number, delayMs: number) {
  let lastErr: any = null;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
      const text = await res.text();
      return { res, text };
    } catch (e) {
      lastErr = e;
      await wait(delayMs);
    }
  }
  throw lastErr || new Error("fetch_failed");
}

describe("health smoke (single HTTP)", () => {
  it(
    "/api/health responds and is json (robust, retry)",
    async () => {
      const { res, text } = await fetchWithRetries(`${baseUrl()}/api/health`, 30, 250);
      expect(res.status).toBe(200);
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
      expect(json && typeof json === "object").toBe(true);
      expect(json.ok).toBe(true);
    },
    120000
  );
});
