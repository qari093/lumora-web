import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP frontend tracking wiring", () => {
  it("posts real user behavior to the FYP tracking endpoint", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(source).toContain('fetch("/api/fyp/track"');
    expect(source).toContain('event: "impression"');
    expect(source).toContain('event: "view"');
    expect(source).toContain('event: signal.saved ? "save"');
    expect(source).toContain("sessionIdRef.current");
    expect(source).toContain("keepalive: true");
  });
});
