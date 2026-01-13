import { describe, it, expect } from "vitest";

type FetchOut = { status: number; ct: string; head: string };

async function fetchHead(url: string, timeoutMs = 15000): Promise<FetchOut> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, { redirect: "manual", signal: ac.signal });
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const txt = await r.text();
    return { status: r.status, ct, head: txt.slice(0, 220) };
  } finally {
    clearTimeout(t);
  }
}

const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

// Keep this list aligned with Lumora “all portals active” requirement.
// Allow redirects (auth, canonicalization) but disallow 404/500.
const PATHS: Array<{ path: string; name: string }> = [
  { path: "/", name: "home" },
  { path: "/fyp", name: "FYP" },
  { path: "/gmar", name: "GMAR" },
  { path: "/videos", name: "Videos" },
  { path: "/nexa", name: "NEXA" },
  { path: "/movies", name: "Movies" },
  { path: "/live", name: "Live" },
  { path: "/share", name: "Share" },
  { path: "/celebrations", name: "Celebrations" },
];

describe("portals: route smoke", () => {
  it(
    "all portal routes respond (200 or redirect)",
    async () => {
      const bad: Array<{ name: string; path: string; status: number; head: string }> = [];
      for (const p of PATHS) {
        const u = `${base}${p.path}`;
        const out = await fetchHead(u, 20000);
        const ok = out.status === 200 || out.status === 301 || out.status === 302 || out.status === 307 || out.status === 308;
        if (!ok) bad.push({ name: p.name, path: p.path, status: out.status, head: out.head });
        // If 200, should be HTML-ish (Next pages) or JSON for API-like pages
        if (out.status === 200) {
          const htmlish = out.ct.includes("text/html") || out.head.includes("<!DOCTYPE html") || out.head.includes("<html");
          const jsonish = out.ct.includes("application/json") || out.head.trim().startsWith("{");
          expect(htmlish || jsonish).toBe(true);
        }
      }
      if (bad.length) {
        throw new Error(
          `Portal smoke failures:\n` +
            bad.map((b) => `- ${b.name} ${b.path}: ${b.status}\n  head: ${b.head.replace(/\s+/g, " ").slice(0, 180)}`).join("\n")
        );
      }
      expect(bad.length).toBe(0);
    },
    60000
  );
});
