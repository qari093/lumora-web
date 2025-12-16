// @ts-nocheck
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const clientRel = "app/_client/emml-client.ts";
const clientPath = join(root, clientRel);

describe("EMML Client Helpers — Contract Guard", () => {
  it("should have the EMML client file", () => {
    expect(existsSync(clientPath)).toBe(true);
  });

  it("should export core helper functions", async () => {
    const mod = await import("../app/_client/emml-client");

    expect(typeof mod.fetchEmmlIndices).toBe("function");
    expect(typeof mod.fetchEmmlHeat).toBe("function");
    expect(typeof mod.fetchEmmlAssets).toBe("function");
  });

  it('should be marked as a "use client" module', () => {
    const src = require("node:fs").readFileSync(clientPath, "utf8");
    expect(src.startsWith('"use client";') || src.startsWith("'use client';")).toBe(
      true,
    );
  });
});
