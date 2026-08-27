import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "../_helpers/ensureServer";

const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

const MEGA19_TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL?.trim() || "";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(MEGA19_TEST_DATABASE_URL);

if (MEGA19_HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = MEGA19_TEST_DATABASE_URL;
}

describe.skipIf(!MEGA19_HAS_SAFE_TEST_DATABASE)("wallet api (smoke)", () => {
  beforeAll(async () => {
    await ensureServer();
  }, 60_000);

  afterAll(async () => {
    await shutdownServer();
  });

  it("GET /api/wallet/balance requires userId", async () => {
    const r = await fetch(`${BASE}/api/wallet/balance`);
    expect(r.status).toBe(400);
    const j = await r.json();
    expect(j.ok).toBe(false);
  });

  it("GET /api/wallet/balance returns credits number", async () => {
    const userId = "test_user_wallet_balance";
    const r = await fetch(`${BASE}/api/wallet/balance?userId=${encodeURIComponent(userId)}`);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.ok).toBe(true);
    expect(j.userId).toBe(userId);
    expect(typeof j.credits).toBe("number");
    expect(typeof j.walletId).toBe("string");
  });

  it("GET /api/wallet/history returns items array", async () => {
    const userId = "test_user_wallet_history";
    const r = await fetch(`${BASE}/api/wallet/history?userId=${encodeURIComponent(userId)}&limit=25`);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.ok).toBe(true);
    expect(j.userId).toBe(userId);
    expect(Array.isArray(j.items)).toBe(true);
    expect(j.nextCursor === null || typeof j.nextCursor === "string").toBe(true);
  });
});
