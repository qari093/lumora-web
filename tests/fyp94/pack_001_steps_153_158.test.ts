import { describe, expect, it } from "vitest";
import {
  FYP94_FORBIDDEN_SOURCE_TYPES,
  FYP94_LOCKED_RULES,
  assertFyp94SourceAllowed,
  assertNoYouTubeCoreFyp,
  isApprovedFyp94Source,
} from "../../src/lib/fyp94/core/policy";
import {
  FYP94_EXECUTION_CONSTRAINTS,
  validateAntiOverengineeringConstraint,
} from "../../src/lib/fyp94/core/constraints";

describe("FYP 9.4 Pack 001 — System Lock & Foundations", () => {
  it("locks native-only and no-YouTube-core policy", () => {
    expect(FYP94_LOCKED_RULES.nativeOnlyCoreFyp).toBe(true);
    expect(FYP94_LOCKED_RULES.youtubeCoreFypAllowed).toBe(false);
    expect(FYP94_LOCKED_RULES.youtubeTrendMetadataAllowed).toBe(true);
  });

  it("allows only approved legal supply sources", () => {
    expect(isApprovedFyp94Source("pexels")).toBe(true);
    expect(isApprovedFyp94Source("youtube_download")).toBe(false);
    expect(() => assertFyp94SourceAllowed("unknown_license")).toThrow();
  });

  it("blocks YouTube from core FYP playback", () => {
    expect(FYP94_FORBIDDEN_SOURCE_TYPES).toContain("youtube_download");
    expect(FYP94_FORBIDDEN_SOURCE_TYPES).toContain("youtube_iframe_core_fyp");
    expect(() => assertNoYouTubeCoreFyp("youtube_iframe_core_fyp")).toThrow();
  });

  it("locks anti-overengineering runtime constraints", () => {
    expect(FYP94_EXECUTION_CONSTRAINTS.maxRenderedVideoCards).toBe(3);
    expect(FYP94_EXECUTION_CONSTRAINTS.maxActiveVideoPlayers).toBe(1);
    expect(FYP94_EXECUTION_CONSTRAINTS.targetSwipeWindowMs).toBe(200);

    const ok = validateAntiOverengineeringConstraint({
      renderedVideoCards: 3,
      activeVideoPlayers: 1,
      fomoStackDepth: 1,
    });

    const bad = validateAntiOverengineeringConstraint({
      renderedVideoCards: 5,
      activeVideoPlayers: 2,
      fomoStackDepth: 3,
    });

    expect(ok.ok).toBe(true);
    expect(bad.ok).toBe(false);
  });
});
