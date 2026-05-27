import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildRuntimeMultiSource } from "@/src/lib/content/runtime/buildRuntimeMultiSource";
import { buildRuntimeFypFeed } from "@/src/lib/content/runtime/buildRuntimeFypFeed";

describe("Lumora Pack 11 — runtime FYP route wiring", () => {
  it("builds runtime multi-source state", async () => {
    const out = await buildRuntimeMultiSource();
    expect(out.rawCount).toBeGreaterThanOrEqual(45);
    expect(out.acceptedCount).toBeGreaterThan(0);
  });

  it("builds runtime FYP feed with multi-source items", async () => {
    const out = await buildRuntimeFypFeed([{ id: "existing" }]);
    expect(out.ok).toBe(true);
    expect(out.items.length).toBeGreaterThan(1);
    expect(out.debug.multiSourceCount).toBeGreaterThan(0);
  });

  it("creates feed and proof API routes", () => {
    expect(fs.existsSync("app/api/content/multi-source/feed/route.ts")).toBe(true);
    expect(fs.existsSync("app/api/content/multi-source/proof/route.ts")).toBe(true);
  });
});
