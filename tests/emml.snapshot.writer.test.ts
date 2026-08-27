// @ts-nocheck
import { describe, it, expect } from "vitest";
import { persistEmmlSnapshot } from "../app/_server/emml-snapshot";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const MEGA19_TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL?.trim() || "";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(MEGA19_TEST_DATABASE_URL);

if (MEGA19_HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = MEGA19_TEST_DATABASE_URL;
}

describe.skipIf(!MEGA19_HAS_SAFE_TEST_DATABASE)("EMML Snapshot Writer — Helper Contract", () => {
  it("should export persistEmmlSnapshot()", () => {
    expect(typeof persistEmmlSnapshot).toBe("function");
  });

  it("should write a valid snapshot row", async () => {
        await db.emmlSnapshot.deleteMany(); // Step 1767 cleanup: deterministic count
    const beforeCount = await db.emmlSnapshot.count();
    await persistEmmlSnapshot({
      marketsOnline: 3,
      indicesTracked: 7,
      heatSampleSize: 150,
      health: "ok",
    });

    const afterCount = await db.emmlSnapshot.count();
    expect(afterCount).toBe(beforeCount + 1);

    const latest = await db.emmlSnapshot.findFirst({
      orderBy: { createdAt: "desc" },
    });

    expect(latest).not.toBeNull();
    expect(latest?.marketsOnline).toBeGreaterThanOrEqual(0);
    expect(latest?.indicesTracked).toBeGreaterThanOrEqual(0);
    expect(latest?.heatSampleSize).toBeGreaterThanOrEqual(0);
    expect(["ok", "degraded", "down"]).toContain(latest?.health);
  });
});
