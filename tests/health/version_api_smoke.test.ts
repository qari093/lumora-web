import { describe, it, expect } from "vitest";

async function fetchJson(url: string, timeoutMs = 15000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ac.signal });
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const txt = await r.text();
    let j: any = null;
    try {
      j = JSON.parse(txt);
    } catch {
      j = null;
    }
    return { r, ct, txt, j };
  } finally {
    clearTimeout(t);
  }
}

describe("/api/version smoke", () => {
  it(
    "returns 200 and JSON with ok/service/version fields",
    async () => {
      const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";
      const { r, ct, j, txt } = await fetchJson(`${base}/api/version`, 20000);
      expect(r.status).toBe(200);
      expect(ct).toContain("application/json");
      expect(j).not.toBe(null);
      expect(j.ok).toBe(true);
      expect(typeof j.service).toBe("string");
      expect(typeof j.version).toBe("string");
      expect(typeof j.commit).toBe("string");
      expect(typeof j.ts).toBe("number");
      if (!j || j.ok !== true) {
        throw new Error(`Unexpected body: ${txt.slice(0, 400)}`);
      }
    },
    25000
  );
});
