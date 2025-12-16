// @ts-nocheck
// FILE: tests/emml.ingest.test.ts

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ingestPath = join(root, "app/api/emml/ingest/route.ts");

describe("EMML Ingest — Contract Guard", () => {
  it("should have the ingest route file", () => {
    expect(existsSync(ingestPath)).toBe(true);
  });

  it("should export POST handler", () => {
    const src = readFileSync(ingestPath, "utf8");
    expect(src.includes("export async function POST")).toBe(true);
  });

  it("should reference indices or heat or assets ingestion logic", () => {
    const src = readFileSync(ingestPath, "utf8").toLowerCase();
    const ok =
      src.includes("indices") ||
      src.includes("heat") ||
      src.includes("assets") ||
      src.includes("ingest");
    expect(ok).toBe(true);
  });
});