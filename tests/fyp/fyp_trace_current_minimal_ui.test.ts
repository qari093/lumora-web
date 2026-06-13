import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Trace Current minimal UI transformation", () => {
  it("adds touch-to-reveal chrome state", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(source).toContain("chromeVisible");
    expect(source).toContain("revealChrome");
    expect(source).toContain('data-chrome-visible={chromeVisible}');
    expect(source).toContain("setTimeout(() =>");
  });

  it("hides dashboard-style FYP UI by default", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).toContain("TRACE CURRENT MEGA PACK 03");
    expect(css).toContain(".traceDock");
    expect(css).toContain("display: none !important");
    expect(css).toContain('.fullscreenCard[data-chrome-visible="true"] .retentionRing');
    expect(css).toContain('.laneSwitch button[data-active="true"]');
  });
});
