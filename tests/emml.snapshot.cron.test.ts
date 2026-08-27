// @ts-nocheck
import { describe, it, expect, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { runOnce } from "./emml.snapshot.cron.helper";

const db = new PrismaClient();

afterAll(async () => {
  await db.$disconnect();
});

const MEGA19_TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL?.trim() || "";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(MEGA19_TEST_DATABASE_URL);

if (MEGA19_HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = MEGA19_TEST_DATABASE_URL;
}

describe.skipIf(!MEGA19_HAS_SAFE_TEST_DATABASE)("EMML Snapshot Cron — Helper", () => {
  it("should expose runOnce()", () => {
    expect(typeof runOnce).toBe("function");
  });

  it("should create at least one new snapshot row when runOnce is executed", async () => {
    const before = await db.emmlSnapshot.count();

    await runOnce();

    const after = await db.emmlSnapshot.count();
    expect(after).toBeGreaterThanOrEqual(before + 1);
  });
});
