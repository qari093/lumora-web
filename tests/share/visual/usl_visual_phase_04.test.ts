import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createCanonicalDeviceTargets,
  summarizeDeviceValidation,
  validateDeviceShareTarget,
} from "@/src/core/share";

describe("USL Visual Route Integration — Phase 04/06 Cross-Platform & Device Validation", () => {
  it("creates canonical device validation targets", () => {
    const targets = createCanonicalDeviceTargets();

    expect(targets).toHaveLength(5);
    expect(targets.map((target) => target.id)).toContain("iphone_pwa");
    expect(targets.map((target) => target.id)).toContain("android_chrome");
    expect(targets.map((target) => target.id)).toContain("mac_safari");
    expect(targets.map((target) => target.id)).toContain("windows_chrome");
    expect(targets.map((target) => target.id)).toContain("offline_web");
  });

  it("validates iOS and Android native share paths", () => {
    const targets = createCanonicalDeviceTargets().filter((target) =>
      ["iphone_pwa", "android_chrome"].includes(target.id),
    );

    const results = targets.map(validateDeviceShareTarget);

    expect(results.every((result) => result.passed)).toBe(true);
    expect(results.find((result) => result.id === "iphone_pwa")?.preferredBridge).toBe("native_share");
    expect(results.find((result) => result.id === "android_chrome")?.preferredBridge).toBe("native_share");
  });

  it("validates desktop and clipboard fallback paths", () => {
    const targets = createCanonicalDeviceTargets().filter((target) =>
      ["mac_safari", "windows_chrome"].includes(target.id),
    );

    const results = targets.map(validateDeviceShareTarget);

    expect(results.every((result) => result.passed)).toBe(true);
    expect(results.find((result) => result.id === "mac_safari")?.preferredBridge).toBe("airdrop");
    expect(results.find((result) => result.id === "windows_chrome")?.preferredBridge).toBe("clipboard");
  });

  it("validates offline-safe fallback behavior", () => {
    const target = createCanonicalDeviceTargets().find((item) => item.id === "offline_web");
    if (!target) throw new Error("missing_offline_target");

    const result = validateDeviceShareTarget(target);

    expect(result.passed).toBe(true);
    expect(result.preferredBridge).toBe("clipboard");
    expect(result.checks.find((check) => check.id === "offline_safe")?.passed).toBe(true);
  });

  it("summarizes cross-platform readiness and prerequisite locks", () => {
    const results = createCanonicalDeviceTargets().map(validateDeviceShareTarget);
    const summary = summarizeDeviceValidation(results);

    expect(summary.ready).toBe(true);
    expect(summary.score).toBe(1);
    expect(fs.existsSync(".lumora_usl_visual_phase_01_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_02_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_03_lock")).toBe(true);
  });
});
