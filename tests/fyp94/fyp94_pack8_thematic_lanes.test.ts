import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Pack 8 — Thematic Lanes", () => {
  it("integrates lane mixing into API", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("mixFyp94Lanes");
  });

  it("lane mapping logic exists", () => {
    const map = fs.readFileSync("src/lib/fyp94/lanes/map.ts", "utf8");

    expect(map).toContain("cosmic");
    expect(map).toContain("urban");
    expect(map).toContain("action");
    expect(map).toContain("calm");
    expect(map).toContain("retro");
  });
});
