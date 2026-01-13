import { describe, it, expect } from "vitest";

type HeadOut = {
  status: number;
  get: (name: string) => string | null;
  ct: string;
  head: string;
};

async function getUrl(url: string, timeoutMs: number): Promise<HeadOut> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      method: "GET",
      signal: ac.signal,
      redirect: "manual" as any,
      headers: { accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
    });
    const txt = await r.text().catch(() => "");
    const head = txt.slice(0, 240);
    return {
      status: r.status,
      get: (name: string) => r.headers.get(name),
      ct: r.headers.get("content-type") || "",
      head,
    };
  } finally {
    clearTimeout(t);
  }
}

const low = (s: string | null) => (s || "").toLowerCase();

describe("security headers: smoke", () => {
  it(
    "health includes X-Content-Type-Options: nosniff",
    async () => {
      const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";
      const o = await getUrl(`${base}/api/health`, 25000);
      expect([200, 204]).toContain(o.status);
      const xcto = o.get("x-content-type-options");
      expect(xcto).not.toBeNull();
      expect(low(xcto)).toContain("nosniff");
    },
    30000
  );

  it(
    "core portal routes exist (no 404) and include nosniff",
    async () => {
      const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";
      const paths = ["/", "/fyp", "/gmar", "/video", "/nexa", "/movies", "/live", "/share", "/celebrations"];

      for (const p of paths) {
        const o = await getUrl(`${base}${p}`, 35000);
        const ok = [200, 301, 302, 307, 308].includes(o.status);
        if (!ok) {
          throw new Error(`portal route failed: ${p} status=${o.status} ct=${o.ct} head=${o.head}`);
        }
        const xcto = o.get("x-content-type-options");
        if (!xcto) {
          throw new Error(`missing x-content-type-options on ${p} status=${o.status} ct=${o.ct} head=${o.head}`);
        }
        expect(low(xcto)).toContain("nosniff");
      }
    },
    90000
  );
});
