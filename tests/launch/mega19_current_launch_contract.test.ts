import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Mega Step 19 current launch contract", () => {
  it("keeps the private beta home as a real ecosystem hub", () => {
    const source = fs.readFileSync("app/page.tsx", "utf8");

    expect(source).toContain("Lumora Private Beta");
    expect(source).toContain("href=\"/signup\"");
    expect(source).toContain("href=\"/login\"");

    for (const route of [
      "/fyp",
      "/live",
      "/gmar",
      "/lumaspace",
      "/lumexa/shop",
      "/movies",
      "/music",
      "/creator",
    ]) {
      expect(source).toContain(route);
    }

    expect(source).not.toContain("Home ✅");
  });

  it("keeps canonical readiness routes present", () => {
    for (const file of [
      "app/api/health/route.ts",
      "app/api/healthz/route.ts",
      "app/api/ready/route.ts",
      "app/api/readyz/route.ts",
    ]) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it("does not use historical 111 step state as the active launch gate", () => {
    for (const file of [
      "tests/launch/launch_run_state.test.ts",
      "tests/launch/launch_prehandoff_state.test.ts",
      "tests/launch/release_readiness_state.test.ts",
      "tests/launch/release_seal.test.ts",
    ]) {
      expect(fs.existsSync(file)).toBe(false);
    }
  });
});
