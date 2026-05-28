import { describe, expect, it } from "vitest";
import { evaluateLiveSafety } from "@/lib/live/liveSafety";

describe("live safety", () => {
  it("activates calm mode under high intensity", () => {
    expect(evaluateLiveSafety(0.9).calmMode).toBe(true);
    expect(evaluateLiveSafety(0.9).allowEscalation).toBe(false);
  });
});
