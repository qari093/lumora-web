import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = Number(process.env.PORT || 3000);
const BASE = `http://127.0.0.1:${PORT}`;

function curl(url: string, rsc: boolean): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      "-sS",
      "--max-time",
      "20",
      "--retry",
      "2",
      "--retry-connrefused",
      "--retry-delay",
      "1",
      "-w",
      "\n%{http_code}",
      url,
    ];
    if (rsc) args.unshift("-H", "RSC: 1");
    const p = spawn("curl", args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += String(d)));
    p.stderr.on("data", (d) => (err += String(d)));
    p.on("error", reject);
    p.on("close", (code) => {
      if (code !== 0) return reject(new Error(`curl failed (${code}): ${err}`));
      const m = out.match(/\n(\d{3})\s*$/);
      if (!m) return reject(new Error(`curl missing status: ${out.slice(-220)}`));
      const status = Number(m[1]);
      const body = out.slice(0, out.length - m[0].length);
      resolve({ status, body });
    });
  });
}

let proc: ReturnType<typeof spawn> | null = null;

async function waitForServer(timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await curl(`${BASE}/create`, false);
      if (r.status === 200) return;
    } catch {}
    await delay(750);
  }
  throw new Error(`server not ready on ${BASE}`);
}

beforeAll(async () => {
  // Kill any lingering dev server on this port (best-effort)
  try {
    spawn("sh", ["-lc", `lsof -ti tcp:${PORT} | xargs kill -9 >/dev/null 2>&1 || true`], {
      stdio: "ignore",
    });
  } catch {}

  proc = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    stdio: ["ignore", "ignore", "ignore"],
    env: { ...process.env, PORT: String(PORT) },
  });

  await delay(1500);
  await waitForServer();
}, 120000);

afterAll(async () => {
  if (proc) {
    proc.kill("SIGTERM");
    proc = null;
  }
}, 30000);

const reShell = /"data-create-shell":"1"|data-create-shell\\":\\\"1/i;
const reUI = /"data-create-ui":"1"|data-create-ui\\":\\\"1/i;
const reCta = (k: "upload" | "record" | "publish") =>
  new RegExp(`"data-create-cta":"${k}"|data-create-cta\\\\":\\\\\\"${k}`, "i");
const reRedirect = /NEXT_REDIRECT/i;

describe("Create RSC markers", () => {
  test(
    "/create has shell + ui + all CTAs in RSC",
    async () => {
      const r = await curl(`${BASE}/create`, true);
      expect(r.status).toBe(200);
      expect(reShell.test(r.body)).toBe(true);
      expect(reUI.test(r.body)).toBe(true);
      expect(reCta("upload").test(r.body)).toBe(true);
      expect(reCta("record").test(r.body)).toBe(true);
      expect(reCta("publish").test(r.body)).toBe(true);
    },
    30000
  );

  test.each(["upload", "record", "publish"] as const)(
    "/create/%s has shell + ui + all CTAs in RSC",
    async (p) => {
      const r = await curl(`${BASE}/create/${p}`, true);
      expect(r.status).toBe(200);
      expect(reShell.test(r.body)).toBe(true);
      expect(reUI.test(r.body)).toBe(true);
      expect(reCta("upload").test(r.body)).toBe(true);
      expect(reCta("record").test(r.body)).toBe(true);
      expect(reCta("publish").test(r.body)).toBe(true);
    },
    30000
  );

  test(
    "/creator emits NEXT_REDIRECT in RSC and /create contains markers",
    async () => {
      const r1 = await curl(`${BASE}/creator`, true);
      expect(r1.status).toBe(200);
      expect(reRedirect.test(r1.body)).toBe(true);

      const r2 = await curl(`${BASE}/create`, true);
      expect(r2.status).toBe(200);
      expect(reShell.test(r2.body)).toBe(true);
      expect(reUI.test(r2.body)).toBe(true);
    },
    30000
  );
});
