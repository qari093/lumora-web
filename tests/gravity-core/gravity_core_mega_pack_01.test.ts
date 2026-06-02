import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GravityCoreController,
  computeGravityIntent,
  getScrollDirection,
  getScrollVelocity,
  isGravityCoreShadowEnabled,
} from "@/src/core/gravity-core";

describe("Gravity Core Mega Pack 1/5", () => {
  it("enables shadow mode by default", () => {
    expect(isGravityCoreShadowEnabled({})).toBe(true);
    expect(isGravityCoreShadowEnabled({ GRAVITY_CORE_SHADOW: "false" })).toBe(false);
    expect(isGravityCoreShadowEnabled({ NEXT_PUBLIC_GRAVITY_CORE_SHADOW: "true" })).toBe(true);
  });

  it("tracks scroll direction and velocity", () => {
    const previous = { scrollY: 100, maxScrollY: 1000, timestamp: 1000, viewportHeight: 800, documentHeight: 1800 };
    const current = { scrollY: 260, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 };

    expect(getScrollDirection(previous, current)).toBe("down");
    expect(getScrollVelocity(previous, current)).toBeGreaterThan(1);
  });

  it("computes intent without navigation side effects", () => {
    const result = computeGravityIntent({
      previous: { scrollY: 800, maxScrollY: 1000, timestamp: 1000, viewportHeight: 800, documentHeight: 1800 },
      current: { scrollY: 990, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 },
      repeatedAttempts: 4,
      hesitationMs: 900,
    });

    expect(result.intentScore).toBeGreaterThan(0.4);
    expect(result.shadowOnly).toBe(true);
    expect(result.shouldNavigate).toBe(false);
  });

  it("controller stays shadow-safe", () => {
    const controller = new GravityCoreController("shadow");
    const first = controller.sample({ scrollY: 700, maxScrollY: 1000, timestamp: 1000, viewportHeight: 800, documentHeight: 1800 });
    const second = controller.sample({ scrollY: 990, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 });

    expect(first.shouldNavigate).toBe(false);
    expect(second.shouldNavigate).toBe(false);
    expect(controller.getMode()).toBe("shadow");
  });

  it("mounts GravityCoreShadow on FYP", () => {
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");
    const component = fs.readFileSync("components/fyp/GravityCoreShadow.tsx", "utf8");

    expect(page).toContain("GravityCoreShadow");
    expect(component).toContain('data-gravity-core="shadow"');
  });
});
