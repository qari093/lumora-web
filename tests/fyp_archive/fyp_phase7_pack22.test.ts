import { describe, expect, it } from "vitest";
import {
  buildMicroHookFeed,
  computeHookScore,
  injectMicroHooks,
  markHookMoments,
  preventHookOverload,
} from "../../src/lib/fyp_archive/micro_hook";

describe("Phase 7 Pack 22 — Micro Hook", () => {
  const items = [
    { id: "1", curiosityScore: 0.5 },
    { id: "2", viralScore: 0.6 },
    { id: "3", humanScore: 0.4 },
  ];

  it("computes hook score", () => {
    expect(computeHookScore(items[0])).toBeGreaterThan(0);
  });

  it("marks hook moments", () => {
    const out = markHookMoments(items);
    expect(out.some((x: any) => x.isHook)).toBe(true);
  });

  it("injects micro hooks", () => {
    const out = injectMicroHooks(markHookMoments(items));
    expect(out.some((x: any) => x.microHook)).toBe(true);
  });

  it("prevents hook overload", () => {
    const feed = [
      { microHook: true },
      { microHook: true },
      { microHook: true },
    ];
    const out = preventHookOverload(feed, 2);
    expect(out.length).toBe(2);
  });

  it("builds micro hook feed", () => {
    const out = buildMicroHookFeed(items);
    expect(out.length).toBeGreaterThan(0);
  });
});
