import { describe, it, expect } from "vitest";

import {
  getEnabledRefreshSources
} from "../../../src/core/fyp/refresh/sourceRefreshRegistry";

import {
  buildRefreshJobs
} from "../../../src/core/fyp/refresh/refreshScheduler";

import {
  isHealthySource
} from "../../../src/core/fyp/refresh/healthTracker";

describe("FYP Omega Pack 05", () => {

  it("loads enabled sources", () => {
    expect(
      getEnabledRefreshSources().length
    ).toBeGreaterThan(0);
  });

  it("creates refresh jobs", () => {
    expect(
      buildRefreshJobs().length
    ).toBeGreaterThan(0);
  });

  it("detects healthy source", () => {
    expect(
      isHealthySource({
        sourceId: "PEXELS",
        successRate: 0.95
      })
    ).toBe(true);
  });

});
