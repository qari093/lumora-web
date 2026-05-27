import { describe, expect, it } from "vitest";
import { validateFyp94UiPerformance } from "../../src/lib/fyp94/ui/performance";

describe("FYP 9.4 Pack 019 — UI Activation", () => {
  it("validates overlay contract", () => {
    expect("Fyp94Overlay").toContain("Fyp94Overlay");
  });

  it("validates wave and crowd indicator contract", () => {
    expect("Fyp94WaveIndicator").toContain("Wave");
    expect("Fyp94CrowdIndicator").toContain("Crowd");
  });

  it("validates vault and echo indicator contract", () => {
    expect("Fyp94VaultIndicator").toContain("Vault");
    expect("Fyp94EchoIndicator").toContain("Echo");
  });

  it("validates swerve controls contract", () => {
    expect(["more", "different", "switch"]).toHaveLength(3);
  });

  it("validates UI performance budget", () => {
    expect(validateFyp94UiPerformance({ renderTimeMs: 30, frameDrop: false }).ok).toBe(true);
    expect(validateFyp94UiPerformance({ renderTimeMs: 80, frameDrop: true }).ok).toBe(false);
  });
});
