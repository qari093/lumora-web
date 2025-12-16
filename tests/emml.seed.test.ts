// @ts-nocheck
import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

describe("EMML Seed — Baseline Coverage", () => {
  it("should have at least one EMML index", async () => {
    const count = await db.emmlIndex.count();
    expect(count).toBeGreaterThan(0);
  });

  it("should have at least one EMML market and asset", async () => {
    const marketCount = await db.emmlMarket.count();
    const assetCount = await db.emmlAsset.count();
    expect(marketCount).toBeGreaterThan(0);
    expect(assetCount).toBeGreaterThan(0);
  });

  it("should have some EMML ticks for demo charts", async () => {
    const tickCount = await db.emmlTick.count();
    expect(tickCount).toBeGreaterThan(0);
  });
});
