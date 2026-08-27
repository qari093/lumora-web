import { describe, it, expect } from "vitest";

async function getJson(url: string) {
  const res = await fetch(url, { headers: { "accept": "application/json" } });
  const text = await res.text();
  let j: any = null;
  try { j = JSON.parse(text); } catch {}
  return { res, text, j };
}

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

const MEGA19_TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL?.trim() || "";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(MEGA19_TEST_DATABASE_URL);

if (MEGA19_HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = MEGA19_TEST_DATABASE_URL;
}

describe.skipIf(!MEGA19_HAS_SAFE_TEST_DATABASE)("CineVerse/Echo list APIs (seed)", () => {
  it("GET /api/cineverse/list returns ok + non-empty", async () => {
    const { res, j, text } = await getJson(`${BASE}/api/cineverse/list`);
    expect(res.status, text).toBe(200);
    expect(j?.ok).toBe(true);
    expect(Array.isArray(j?.items)).toBe(true);
    expect(j.items.length).toBeGreaterThan(0);
    const m = j.items[0];
    expect(typeof m?.id).toBe("string");
    expect(typeof m?.title).toBe("string");
    expect(typeof m?.videoUrl).toBe("string");
    expect(typeof m?.source).toBe("string");
    expect(typeof m?.license).toBe("string");
    expect(typeof m?.category).toBe("string");
    expect(typeof m?.resolution).toBe("string");
  });

  it("GET /api/echo/list returns ok + non-empty", async () => {
    const { res, j, text } = await getJson(`${BASE}/api/echo/list`);
    expect(res.status, text).toBe(200);
    expect(j?.ok).toBe(true);
    expect(Array.isArray(j?.items)).toBe(true);
    expect(j.items.length).toBeGreaterThan(0);
    const t = j.items[0];
    expect(typeof t?.id).toBe("string");
    expect(typeof t?.title).toBe("string");
    expect(typeof t?.artist).toBe("string");
    expect(typeof t?.audioUrl).toBe("string");
    expect(typeof t?.license).toBe("string");
    expect(typeof t?.genre).toBe("string");
  });
});
