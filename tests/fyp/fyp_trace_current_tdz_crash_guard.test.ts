import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Trace Current TDZ crash guard", () => {
  it("does not reference openDeepDive before initialization inside gesture callback", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
    const gestureStart = source.indexOf("const handleTraceGestureEnd");
    const openDeepDiveStart = source.indexOf("const openDeepDive");

    expect(gestureStart).toBeGreaterThan(-1);
    expect(openDeepDiveStart).toBeGreaterThan(-1);
    expect(gestureStart).toBeLessThan(openDeepDiveStart);

    const gestureBlock = source.slice(gestureStart, openDeepDiveStart);
    expect(gestureBlock).not.toContain("openDeepDive(item)");
    expect(gestureBlock).not.toContain("openDeepDive, revealChrome");
    expect(gestureBlock).toContain("setDeepDiveId(item.id)");
    expect(gestureBlock).toContain('event: "deep_dive"');
  });
});
