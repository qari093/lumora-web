import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 visibility pack 002", () => {
  it("binds poster and video rendering", () => {
    const s = fs.readFileSync("src/components/fyp94/Fyp94VisiblePlayer.tsx", "utf8");
    expect(s).toContain("poster={current.posterUrl}");
    expect(s).toContain("src={current.playbackUrl}");
  });

  it("binds overlays and swerve controls", () => {
    const s = fs.readFileSync("src/components/fyp94/Fyp94VisiblePlayer.tsx", "utf8");
    expect(s).toContain("Fyp94WaveIndicator");
    expect(s).toContain("Fyp94CrowdIndicator");
    expect(s).toContain("Fyp94SwerveControls");
  });

  it("binds loading/error state", () => {
    const s = fs.readFileSync("src/components/fyp94/Fyp94VisiblePlayer.tsx", "utf8");
    expect(s).toContain("loadingError");
    expect(s).toContain("onError");
    expect(s).toContain("onLoadedData");
  });
});
