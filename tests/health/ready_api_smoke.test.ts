import { describe, it, expect } from "vitest";

const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

async function fetchJson(url: string, timeoutMs = 15000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, { redirect: "follow", signal: ac.signal });
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const txt = await r.text();
    let j: any = null;
    try { j = JSON.parse(txt); } catch { j = null; }
    return { r, ct, txt, j };
  } finally {
    clearTimeout(t);
  }
}

describe("/api/ready smoke", () => {
  it(
    "returns 200 and JSON-ish body",
    async () => {
      const { r, ct, txt, j } = await fetchJson(`${base}/api/ready`, 15000);
      expect(r.status).toBe(200);
      expect(ct).toContain("application/json");
      expect(j).not.toBe(null);
      expect(typeof j).toBe("object");
      expect(txt.length).toBeGreaterThan(1);
    },
    20000
  );
});
