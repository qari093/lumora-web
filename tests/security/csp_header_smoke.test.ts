import { describe, expect, test } from "vitest";
import { execFileSync, execSync } from "node:child_process";

function __resolveTestBase(): string {
  const env = process.env.TEST_BASE_URL || process.env.BASE_URL;
  if (env && env !== "/") return env;
  return "http://127.0.0.1:3000";
}

const BASE = __resolveTestBase();

  (process.env.BASE_URL ||
    process.env.LUMORA_TEST_BASE ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://127.0.0.1:3000").replace(/\/$/, "");

const PORTAL_HEAD_TIMEOUT_S = 60;

function headViaCurl(path: string, maxTimeSec = 60): { status: number; headers: Record<string, string> } {
  const base = (typeof BASE === "string" && BASE.length) ? BASE : "http://127.0.0.1:3000";
  const url = String(new URL(path, base));
  try {
    // Print headers, then print a final line with status marker for robust parsing.
    const out = execSync(`curl -sS -i --max-time ${maxTimeSec} "${url}" -X HEAD -o - -w "\n__LUMORA_STATUS__:%{http_code}\n"`, {
      stdio: ["ignore", "pipe", "pipe"],
    }).toString("utf8");

    const lines = out.split(/\r?\n/);
    const statusLine = lines.find((l) => l.startsWith("__LUMORA_STATUS__:")) || "";
    const codeStr = statusLine.split(":")[1] || "";
    const status = Number(codeStr.trim() || "0") || 0;

    const headers: Record<string, string> = {};
    for (const line of lines) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const k = line.slice(0, idx).trim().toLowerCase();
        const v = line.slice(idx + 1).trim();
        if (k) headers[k] = v;
      }
    }
    return { status, headers };
  } catch (e: any) {
    const msg = (e && e.message) ? String(e.message) : "curl_failed";
    throw new Error("curl HEAD failed: " + path + " — " + msg);
  }
}

describe("security headers: CSP smoke", () => {
  test(
    "sets Content-Security-Policy on root and core portals (deterministic)",
    async () => {
      const paths = ["/", "/gmar", "/movies", "/nexa", "/video", "/live", "/lumaspace"];
      for (const p of paths) {
        const r = headViaCurl(p);
        expect([200, 301, 302, 307, 308]).toContain(r.status);
        const csp = (r.headers["content-security-policy"] || "").toString();
        expect(csp.length).toBeGreaterThan(0);
      }
    },
    240_000
  );

  test(
    "sets Content-Security-Policy on /api/health",
    async () => {
      const r = headViaCurl("/api/health", 35);
      expect([200, 301, 302, 307, 308]).toContain(r.status);
      const csp = (r.headers["content-security-policy"] || "").toString();
      expect(csp.length).toBeGreaterThan(0);
    },
    120_000
  );
});
