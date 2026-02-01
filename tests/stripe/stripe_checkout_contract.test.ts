import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "../_helpers/ensureServer";

const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

describe("stripe checkout contract", () => {
  beforeAll(async () => {
    await ensureServer();
  }, 60_000);

  afterAll(async () => {
    await shutdownServer();
  });

  it("POST /api/stripe/checkout fails fast when STRIPE_SECRET_KEY missing", async () => {
    const r = await fetch(`${BASE}/api/stripe/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "test_user", credits: 10 }),
    });

    // In CI/local without secrets, must be a clear 500 with explicit error code.
    expect(r.status).toBe(500);
    const j = await r.json();
    expect(j.ok).toBe(false);
    expect(String(j.error || "")).toContain("missing_STRIPE_SECRET_KEY");
  });
});
