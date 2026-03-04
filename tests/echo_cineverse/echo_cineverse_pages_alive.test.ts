import { describe, it, expect } from "vitest";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

async function getText(url: string) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return { res, text };
}

describe("CineVerse/Echo pages alive", () => {
  it("GET /cineverse returns 200 + has heading", async () => {
    const { res, text } = await getText(`${BASE}/cineverse`);
    expect(res.status, text.slice(0, 400)).toBe(200);
    expect(text).toContain("CineVerse");
  });

  it("GET /echo returns 200 + has heading", async () => {
    const { res, text } = await getText(`${BASE}/echo`);
    expect(res.status, text.slice(0, 400)).toBe(200);
    expect(text).toContain("Lumora Echo");
  });
});
