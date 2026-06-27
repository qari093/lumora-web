import { describe, it, expect } from "vitest";

import {
  moderateVideo
} from "../../../src/core/fyp/moderation/moderationEngine";

import {
  addToQuarantine,
  getQuarantineRegistry
} from "../../../src/core/fyp/moderation/quarantineRegistry";

describe("FYP Omega Pack 03", () => {

  it("approves safe content", () => {
    const result = moderateVideo({
      videoId: "safe_1",
      sourceId: "PEXELS",
      violenceScore: 0.1,
      adultScore: 0.1,
      copyrightRisk: 0.1
    });

    expect(result.verdict).toBe("approved");
  });

  it("quarantines medium risk content", () => {
    const result = moderateVideo({
      videoId: "risk_1",
      sourceId: "PEXELS",
      violenceScore: 0.6,
      adultScore: 0.1,
      copyrightRisk: 0.1
    });

    expect(result.verdict).toBe("quarantine");
  });

  it("blocks critical content", () => {
    const result = moderateVideo({
      videoId: "blocked_1",
      sourceId: "PEXELS",
      violenceScore: 0.95,
      adultScore: 0.1,
      copyrightRisk: 0.1
    });

    expect(result.verdict).toBe("blocked");
  });

  it("stores quarantine records", () => {
    addToQuarantine(
      "video_x",
      "manual_review_required"
    );

    expect(
      getQuarantineRegistry().length
    ).toBeGreaterThan(0);
  });

});
