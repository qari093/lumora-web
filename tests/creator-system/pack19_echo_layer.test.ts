import { describe, it, expect } from "vitest";
import { createEchoState } from "@/src/lib/creator-system/echo-layer/echoState";
import { buildEchoFootprint } from "@/src/lib/creator-system/echo-layer/footprint";
import { getEchoVisibilityPolicy } from "@/src/lib/creator-system/echo-layer/visibility";
import { isAllowedEchoInteraction } from "@/src/lib/creator-system/echo-layer/interactions";
import { isEchoExpired, resolveEchoActive } from "@/src/lib/creator-system/echo-layer/expiry";

describe("Pack19 Echo Layer", () => {
  it("creates 24-hour echo state", () => {
    const s = createEchoState({ creatorId: "c1", circleId: "x", nowMs: 0 });
    expect(s.expiresAtMs).toBe(86400000);
    expect(s.active).toBe(true);
  });

  it("builds non-inferred footprint", () => {
    const f = buildEchoFootprint({ present:1, stillness:1, hold:0, rewatch:0, silentOvation:1 });
    expect(f.label).toContain("present");
  });

  it("removes counts/comments", () => {
    const v = getEchoVisibilityPolicy();
    expect(v.showCounts).toBe(false);
    expect(v.showComments).toBe(false);
  });

  it("allows silent ovation only", () => {
    expect(isAllowedEchoInteraction("silent-ovation")).toBe(true);
    expect(isAllowedEchoInteraction("like")).toBe(false);
  });

  it("expires after 24h", () => {
    expect(isEchoExpired(90000, 80000)).toBe(true);
    expect(resolveEchoActive(70000, 80000)).toBe(true);
  });
});
