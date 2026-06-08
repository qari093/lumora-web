import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta feedback collection loop", () => {
  it("writes feedback collection artifacts", () => {
    expect(fs.existsSync("data/private-beta/feedback-collection-loop.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-feedback-collection-loop.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-feedback-collection-loop.md")).toBe(true);
  });

  it("keeps feedback collection controlled", () => {
    const loop = JSON.parse(fs.readFileSync("data/private-beta/feedback-collection-loop.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-feedback-collection-loop.json", "utf8"));

    expect(loop.status).toBe("PRIVATE_BETA_FEEDBACK_COLLECTION_READY");
    expect(loop.collectionMode).toBe("manual_review");
    expect(loop.rules.noPublicReviews).toBe(true);
    expect(loop.rules.manualTriageRequired).toBe(true);
    expect(loop.rules.criticalIssuesPauseRollout).toBe(true);
    expect(loop.rules.paymentFeedbackLiveMode).toBe(false);
    expect(audit.nextCanonicalPhase).toBe("Private beta issue triage board");
  });
});
