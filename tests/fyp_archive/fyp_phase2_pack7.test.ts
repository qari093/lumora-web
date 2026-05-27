import { describe, expect, it } from "vitest";
import {
  buildDecadeBuckets,
  preventSameEraRepetition,
  mixArchiveWithModern,
  injectTemporalJumps,
  buildTimeMachineFeed,
} from "../../src/lib/fyp_archive/time_machine";

describe("Phase 2 Pack 7 — Time Machine", () => {
  it("builds decade buckets", () => {
    const buckets = buildDecadeBuckets([
      { decade: "1960s" },
      { decade: "1970s" },
      { decade: "1960s" },
    ]);

    expect(buckets["1960s"].length).toBe(2);
  });

  it("prevents same era repetition", () => {
    const out = preventSameEraRepetition([
      { decade: "1960s" },
      { decade: "1960s" },
      { decade: "1970s" },
    ]);

    expect(out.length).toBe(2);
  });

  it("mixes archive and modern", () => {
    const out = mixArchiveWithModern(
      [{ id: "a1" }],
      [{ id: "m1" }]
    );

    expect(out.length).toBe(2);
  });

  it("injects temporal jumps", () => {
    const out = injectTemporalJumps([{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }]);
    expect(out[0].timeJump).toBe(true);
  });

  it("builds full time machine feed", () => {
    const out = buildTimeMachineFeed(
      [{ decade: "1960s" }, { decade: "1970s" }],
      [{ decade: "modern" }]
    );

    expect(out.length).toBeGreaterThan(0);
  });
});
