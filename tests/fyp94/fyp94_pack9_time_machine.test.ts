import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { getFyp94Decade } from "../../src/lib/fyp94/time-machine/decade";
import { mixFyp94TimeMachine } from "../../src/lib/fyp94/time-machine/mix";

describe("FYP94 Pack 9 — Time Machine System", () => {
  it("detects decade/era tags", () => {
    expect(getFyp94Decade({ title: "1950 safety film" })).toBe("1950s");
    expect(getFyp94Decade({ query: "retro city archive" })).toBe("retro");
    expect(getFyp94Decade({ source: "nasa" })).toBe("space-era");
    expect(getFyp94Decade({ query: "football match" })).toBe("modern");
  });

  it("mixes temporal buckets", () => {
    const out = mixFyp94TimeMachine([
      { id: "1", title: "1950 safety film" },
      { id: "2", query: "football match" },
      { id: "3", source: "nasa" },
    ]);

    expect(out).toHaveLength(3);
    expect(out.every((x) => x.decade)).toBe(true);
  });

  it("integrates time machine into API shuffle", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("mixFyp94TimeMachine");
    expect(route).toContain("preventSameEraStreak");
  });
});
