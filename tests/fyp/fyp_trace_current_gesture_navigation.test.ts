import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Trace Current Gesture Navigation", () => {
  it("adds pointer gesture handlers to the FYP card shell", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(source).toContain("gestureStartRef");
    expect(source).toContain("handleTraceGestureStart");
    expect(source).toContain("handleTraceGestureEnd");
    expect(source).toContain("moveToRelativeCard");
    expect(source).toContain("openContextPanel");
    expect(source).toContain("onPointerDown={handleTraceGestureStart}");
    expect(source).toContain("onPointerUp={handleTraceGestureEnd}");
  });

  it("keeps spatial Trace Current gestures mapped", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(source).toContain("moveToRelativeCard(dx < 0 ? 1 : -1)");
    expect(source).toContain("openDeepDive(item)");
    expect(source).toContain("openContextPanel(activeId)");
  });
});
