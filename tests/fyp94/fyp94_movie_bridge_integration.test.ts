import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Movie Bridge Integration", () => {
  it("route contains movie injection", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("injectMovieClipsIntoFyp");
    expect(route).toContain("movieMixed");
  });

  it("ensures playbackUrl fallback exists", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("playbackUrl || x.localUrl || x.mp4Url");
  });

  it("adds debug block", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("movieDebug");
  });
});
