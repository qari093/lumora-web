import { describe, expect, it } from "vitest";
import { createCountdownNode } from "@/lib/cineverse/countdownNode";

describe("countdown node", () => {
  it("creates cinematic anticipation node", () => {
    const node = createCountdownNode("Arrival");

    expect(node.hoursRemaining).toBeGreaterThan(0);
  });
});
