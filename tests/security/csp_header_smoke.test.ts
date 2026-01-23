import { describe, expect, test } from "vitest";
import { execFileSync } from "node:child_process";

const BASE =
  (process.env.BASE_URL ||
    process.env.LUMORA_TEST_BASE ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://127.0.0.1:3000").replace(/\/$/, "");

const PORTAL_HEAD_TIMEOUT_S = 60;

function headViaCurl(path: string, timeoutS = PORTAL_HEAD_TIMEOUT_S): { status: number; headers: Record<string, string> } {
  const url = BASE + path;
  try {
    const out = execFileSync(
      "curl",
      ["-sS", "-I", "--max-time", String(timeoutS), url],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    const lines = out.split(/\r?\n/).filter(Boolean);
    const statusLine = lines.find((l) => /^HTTP\//i.test(l)) || "";
    const m = statusLine.match(/\s(\d{3})\s/);
    const status = m ? Number(m[1]) : 0;

    const headers: Record<string, string> = {};
    for (const l of lines) {
      const i = l.indexOf(":");
      if (i > 0) headers[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim();
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
