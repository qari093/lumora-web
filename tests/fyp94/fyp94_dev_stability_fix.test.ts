import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 dev stability fix", () => {
  it("forces node runtime for fs-based FYP API routes", () => {
    const library = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");
    expect(library).toContain('export const runtime = "nodejs"');
    expect(library).toContain('export const dynamic = "force-dynamic"');
  });

  it("has stable auto-restart dev runner", () => {
    const s = fs.readFileSync("scripts/dev/stable-dev.sh", "utf8");
    expect(s).toContain("while true");
    expect(s).toContain("pnpm dev");
    expect(s).toContain("Restarting");
  });
});
