import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "../_helpers/ensureServer";

const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

const MEGA19_STRIPE_SECRET_PRESENT =
  Boolean(process.env.STRIPE_SECRET_KEY?.trim());

describe.skipIf(MEGA19_STRIPE_SECRET_PRESENT)("stripe webhook contract (no secrets)", () => {
  beforeAll(async () => {
    await ensureServer();
  }, 60_000);

  afterAll(async () => {
    await shutdownServer();
  });

  it("POST /api/stripe/webhook fails fast when STRIPE_SECRET_KEY missing", async () => {
    const r = await fetch(`${BASE}/api/stripe/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ hello: "world" }),
    });
    expect(r.status).toBe(500);
    const j = await r.json();
    expect(j.ok).toBe(false);
    // missing secret is the first invariant
    expect(String(j.error || "")).toContain("missing_STRIPE_SECRET_KEY");
  });
});
