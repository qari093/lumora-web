import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("healthz route contract", () => {
  it("exists for vitest global setup", () => {
    expect(fs.existsSync("app/api/healthz/route.ts")).toBe(true);
  });
});
