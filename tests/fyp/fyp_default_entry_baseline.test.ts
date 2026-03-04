import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function read(p: string): string {
  return fs.readFileSync(p, "utf8");
}

describe("FYP default entry baseline (locked)", () => {
  it("app/page.tsx exists and references /fyp as primary entry (redirect or link)", () => {
    const p = path.join(process.cwd(), "app", "page.tsx");
    expect(fs.existsSync(p)).toBe(true);

    const s = read(p);

    // Accept any of these as valid:
    // - redirect("/fyp")
    // - href="/fyp"
    // - router push("/fyp") (rare)
    const ok =
      /redirect\(\s*["']\/fyp["']\s*\)/.test(s) ||
      /href\s*=\s*["']\/fyp["']/.test(s) ||
      /push\(\s*["']\/fyp["']\s*\)/.test(s);

    expect(ok).toBe(true);
  });
});
