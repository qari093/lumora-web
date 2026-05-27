import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("GMAR dynamic prerender fix", () => {
  it("forces /gmar to render dynamically instead of prerendering unstable runtime state", () => {
    const page = readFileSync("app/gmar/page.tsx", "utf8");

    expect(page).toContain('export const dynamic = "force-dynamic";');
    expect(page).toContain("export const revalidate = 0;");
  });
});
