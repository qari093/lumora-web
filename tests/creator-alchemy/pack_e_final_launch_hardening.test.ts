import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  runCreatorAlchemyLaunchGates,
  summarizeLaunchReadiness,
  validateAccessibility,
  validateMobilePwaReadiness
} from "@/src/core/creator-alchemy/launch";

describe("Pack E — Final Launch Hardening", () => {
  it("validates mobile PWA readiness", () => {
    const check = validateMobilePwaReadiness({
      ok: true,
      safeAreaReady: true,
      reducedMotionReady: true,
      touchTargetReady: true
    });

    expect(check.ok).toBe(true);
  });

  it("validates accessibility readiness", () => {
    const check = validateAccessibility({
      ok: true,
      ariaLabelsReady: true,
      reducedMotionReady: true,
      contrastReady: true,
      keyboardSafe: true
    });

    expect(check.ok).toBe(true);
  });

  it("creates launch readiness API route", () => {
    expect(existsSync("app/api/creator-alchemy/launch-readiness/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/launch-readiness/route.ts", "utf8")).toContain("runCreatorAlchemyLaunchGates");
  });

  it("summarizes blocked or ready launch reports", () => {
    const report = runCreatorAlchemyLaunchGates();
    const summary = summarizeLaunchReadiness(report);

    expect(summary).toContain("Creator Alchemy Ω∞");
    expect(["READY_FOR_BETA_VALIDATION", "BLOCKED"]).toContain(report.status);
  });
});
