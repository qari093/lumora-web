import { describe, expect, it } from "vitest";
import { getLivePortalConfig } from "../../src/live/activation/livePortalConfig";

describe("Lumora Live Activation Pack 1", () => {
  it("exposes Live portal config", () => {
    const config = getLivePortalConfig();

    expect(config.id).toBe("live");
    expect(config.route).toBe("/live");
    expect(config.status).toBe("runtime_visible");
  });
});
