import { describe, it, expect } from "vitest";

import { FYP_FEATURE_FLAGS } from "../../../src/core/fyp/governance/flags/featureFlags";
import { FYP_CANARY_CONFIG } from "../../../src/core/fyp/governance/canary/canaryConfig";
import { FYP_ROLLBACK_STATE } from "../../../src/core/fyp/governance/rollback/rollbackConfig";

describe("FYP Omega Pack 01", () => {
  it("feature flags default safe", () => {
    expect(FYP_FEATURE_FLAGS.playbackV2).toBe(false);
  });

  it("canary disabled by default", () => {
    expect(FYP_CANARY_CONFIG.enabled).toBe(false);
  });

  it("rollback enabled", () => {
    expect(FYP_ROLLBACK_STATE.enabled).toBe(true);
  });
});
