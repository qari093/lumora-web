import { afterAll, beforeAll, expect, test } from "vitest";
import { startNextDev } from "../../_helpers/next.testServer.int";

let srv: Awaited<ReturnType<typeof startNextDev>>;

beforeAll(async () => {
  srv = await startNextDev({
    port: 3188,
    env: {
      // ensure seed mode so portals show operational content
      LUMORA_DATA_MODE: "seed",
      LUMORA_SEED_CINEVERSE: "1",
      LUMORA_SEED_ECHO: "1",
      LUMORA_SEED_FYP: "1",
      LUMORA_SEED_VIDEOS: "1",
      LUMORA_SEED_GMAR: "1",
      LUMORA_SEED_NEXA: "1",
      LUMORA_SEED_LIVE: "1",
    },
  });
}, 120_000);

afterAll(async () => {
  await srv?.stop?.();
}, 120_000);

test("GET /api/portals/runtime returns portal list", async () => {
  const res = await fetch(`${srv.baseUrl}/api/portals/runtime`, { redirect: "follow" });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toBeTruthy();
  expect(Array.isArray(json.portals)).toBe(true);
  // must include at least these portals
  const slugs = json.portals.map((p: any) => p.slug);
  for (const s of ["fyp", "videos", "gmar", "nexa", "movies", "music", "live", "share"]) {
    expect(slugs).toContain(s);
  }
});
