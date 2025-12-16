// @ts-nocheck
import { describe, it, expect } from "vitest";
import { getLatestEmmlSnapshot } from "../app/api/emml/health/route";

describe("EMML Health — Snapshot-backed status", () => {
  it("should be able to obtain a latest EMML snapshot", async () => {
    const snap = await getLatestEmmlSnapshot();

    expect(snap).toBeTruthy();
    expect(typeof snap.id).toBe("string");
    expect(snap.updatedAt instanceof Date).toBe(true);
  });

  it("should expose sane numeric fields on the snapshot", async () => {
    const snap = await getLatestEmmlSnapshot();

    expect(typeof snap.marketsOnline).toBe("number");
    expect(typeof snap.indicesTracked).toBe("number");
    expect(typeof snap.heatSampleSize).toBe("number");
    expect(["ok", "degraded", "down"]).toContain(snap.health);
  });
});
