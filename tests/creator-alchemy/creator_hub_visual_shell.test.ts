import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

describe("Creator Hub Visual Shell", () => {
  it("adds the breathing dashboard CSS shell", () => {
    expect(existsSync("src/components/creator-alchemy/BreathingDashboard.css")).toBe(true);
  });

  it("imports the dashboard CSS into the component", () => {
    const component = readFileSync("src/components/creator-alchemy/BreathingDashboard.tsx", "utf8");
    expect(component).toContain('import "./BreathingDashboard.css";');
  });

  it("preserves all dashboard layout zones", () => {
    const css = readFileSync("src/components/creator-alchemy/BreathingDashboard.css", "utf8");
    expect(css).toContain("atmosphere");
    expect(css).toContain("seed");
    expect(css).toContain("whisper");
    expect(css).toContain("river");
    expect(css).toContain("impact");
    expect(css).toContain("prefers-reduced-motion");
  });
});
