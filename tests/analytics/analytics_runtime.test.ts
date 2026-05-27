import { describe, expect, it } from "vitest";
import { trackEvent } from "@/core/analytics/runtime";

describe("analytics runtime", () => {
  it("tracks events", () => {
    expect(trackEvent("page_view").tracked).toBe(true);
  });
});
