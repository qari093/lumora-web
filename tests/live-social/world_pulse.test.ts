import { describe, expect, it } from "vitest";
import { createWorldPulse } from "@/lib/world-pulse/worldPulse";

describe("world pulse", () => {
  it("creates transparent system atmosphere", () => {
    const pulse = createWorldPulse("calm");
    expect(pulse.active).toBe(true);
    expect(pulse.generatedBy).toBe("system-atmosphere");
  });
});
