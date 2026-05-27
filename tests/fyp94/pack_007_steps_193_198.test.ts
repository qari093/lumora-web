import { describe, expect, it } from "vitest";
import { groupFyp94ClipsByCategory } from "../../src/lib/fyp94/narrative/group";
import { buildFyp94NarrativeSequence, detectFyp94PayoffCandidate } from "../../src/lib/fyp94/narrative/sequence";
import {
  abandonFyp94Sequence,
  activateFyp94Sequence,
  completeFyp94Sequence,
  resetAbandonedFyp94Sequence,
} from "../../src/lib/fyp94/narrative/state";
import type { Fyp94NarrativeClip } from "../../src/lib/fyp94/narrative/types";

const clips: Fyp94NarrativeClip[] = [
  { id: "1", title: "setup", category: "surf", tags: ["surf"], thrillScore: 20 },
  { id: "2", title: "tension", category: "surf", tags: ["surf"], thrillScore: 50 },
  { id: "3", title: "payoff", category: "surf", tags: ["surf"], thrillScore: 90 },
  { id: "4", title: "other", category: "bike", tags: ["bike"], thrillScore: 70 },
];

describe("FYP 9.4 Pack 007 — Narrative Engine", () => {
  it("groups clips by category", () => {
    const grouped = groupFyp94ClipsByCategory(clips);
    expect(grouped.surf).toHaveLength(3);
    expect(grouped.bike).toHaveLength(1);
  });

  it("detects payoff candidate", () => {
    const payoff = detectFyp94PayoffCandidate(clips);
    expect(payoff?.id).toBe("3");
  });

  it("builds setup tension payoff sequence", () => {
    const sequence = buildFyp94NarrativeSequence("surf", clips.filter((clip) => clip.category === "surf"));
    expect(sequence?.setup.id).toBe("1");
    expect(sequence?.tension.id).toBe("2");
    expect(sequence?.payoff.id).toBe("3");
    expect(sequence?.state).toBe("ready");
  });

  it("tracks sequence state", () => {
    const sequence = buildFyp94NarrativeSequence("surf", clips.filter((clip) => clip.category === "surf"));
    if (!sequence) throw new Error("sequence missing");

    const active = activateFyp94Sequence(sequence);
    const completed = completeFyp94Sequence(active);
    const abandoned = abandonFyp94Sequence(active);
    const reset = resetAbandonedFyp94Sequence(abandoned);

    expect(active.state).toBe("active");
    expect(completed.state).toBe("completed");
    expect(abandoned.state).toBe("abandoned");
    expect(reset.state).toBe("ready");
  });
});
