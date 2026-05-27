import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 force movie API", () => {
  it("uses movieMixed as returned items", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");
    expect(route).toContain("const movieMixed = injectMovieClipsIntoFyp");
    expect(route).toContain("const items = movieMixed.map");
    expect(route).toContain("movieDebug");
  });
});
