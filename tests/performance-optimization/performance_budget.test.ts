import { describe, expect, it } from "vitest";
import { startupBudget } from "@/src/core/performance-optimization/startup/startupBudget";
import { videoPreloadPolicy } from "@/src/core/performance-optimization/media/videoPreloadPolicy";
import { subscriptionBudget } from "@/src/core/performance-optimization/realtime/subscriptionBudget";

describe("performance budget", () => {
  it("keeps startup mobile first", () => {
    expect(startupBudget.mobileFirst).toBe(true);
  });

  it("limits preload on slow connection", () => {
    expect(videoPreloadPolicy("slow").preloadCount).toBe(0);
  });

  it("keeps realtime subscriptions bounded", () => {
    expect(subscriptionBudget(2).withinBudget).toBe(true);
  });
});
