// @ts-nocheck
import { describe, it, expect, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

afterAll(async () => {
  await db.$disconnect();
});

describe("EMML Persistence — Snapshot Model", () => {
  it("should expose EMMLSnapshot model", () => {
    const anyDb = db as any;

    expect(typeof anyDb.emmlSnapshot).toBe("object");
    expect(typeof anyDb.emmlSnapshot.create).toBe("function");
  });

  it("should create → read → validate snapshot", async () => {
    const anyDb = db as any;

    const created = await anyDb.emmlSnapshot.create({
      data: {
        updatedAt: new Date(),
        marketsOnline: 5,
        indicesTracked: 12,
        heatSampleSize: 300,
        health: "ok",
      },
    });

    const fetched = await anyDb.emmlSnapshot.findUnique({
      where: { id: created.id },
    });

    expect(fetched).not.toBeNull();
    expect(fetched?.health).toBe("ok");
    expect(fetched?.marketsOnline).toBe(5);
    expect(fetched?.indicesTracked).toBe(12);
    expect(fetched?.heatSampleSize).toBe(300);
  });

  it("should enforce required fields", async () => {
    const anyDb = db as any;
    let threw = false;

    try {
      await anyDb.emmlSnapshot.create({
        // @ts-expect-error: intentionally omitting required fields
        data: {},
      });
    } catch {
      threw = true;
    }

    expect(threw).toBe(true);
  });
});
