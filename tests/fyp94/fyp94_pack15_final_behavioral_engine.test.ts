import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  buildFyp94InfiniteFreshPerception,
  enforceFyp94EmotionalUnpredictability,
  inferFyp94Mood,
  injectFyp94RareSurprise,
  mixFyp94EnergyTransitions,
  preventFyp94PatternPredictability,
} from "../../src/lib/fyp94/behavioral/engine";

describe("FYP94 Pack 15 — Final Behavioral Engine", () => {
  const items = [
    { id: "1", query: "football match", category: "Football", thrillScore: 90 },
    { id: "2", query: "nature waterfall", category: "Nature", thrillScore: 40 },
    { id: "3", query: "city street", category: "Urban", thrillScore: 50 },
    { id: "4", query: "retro archive", category: "Retro", thrillScore: 30 },
    { id: "5", query: "basketball game", category: "Basketball", thrillScore: 88 },
    { id: "6", query: "rain calm", category: "Calm", thrillScore: 20 },
    { id: "7", query: "cars driving", category: "Cars", thrillScore: 70 },
  ];

  it("infers emotional mood", () => {
    expect(inferFyp94Mood(items[0])).toBe("energy");
    expect(inferFyp94Mood(items[1])).toBe("calm");
    expect(inferFyp94Mood(items[3])).toBe("curiosity");
  });

  it("adds emotional unpredictability metadata", () => {
    const out = enforceFyp94EmotionalUnpredictability(items);
    expect(out.every((item: any) => item.mood)).toBe(true);
    expect(out.some((item: any) => item.behavioralSlot === "surprise")).toBe(true);
  });

  it("mixes high-energy and calm transitions", () => {
    const out = mixFyp94EnergyTransitions(items);
    expect(out).toHaveLength(items.length);
  });

  it("injects rare surprise and prevents pattern predictability", () => {
    const surprise = injectFyp94RareSurprise(items);
    expect(surprise.some((item: any) => item.rareSurprise)).toBe(true);

    const antiPattern = preventFyp94PatternPredictability(items);
    expect(antiPattern.length).toBeGreaterThan(0);
  });

  it("builds final infinite fresh perception flow", () => {
    const out = buildFyp94InfiniteFreshPerception(items);
    expect(out.length).toBeGreaterThan(0);
    expect(out.some((item: any) => item.mood)).toBe(true);
  });

  it("integrates final behavioral engine into feed API", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");
    expect(route).toContain("buildFyp94InfiniteFreshPerception");
  });

  it("locks final behavioral docs", () => {
    const doc = fs.readFileSync("docs/fyp94/FINAL_BEHAVIORAL_ENGINE.md", "utf8");
    expect(doc).toContain("emotional unpredictability");
    expect(doc).toContain("infinite fresh perception");
    expect(doc).toContain("No YouTube ingestion");
  });
});
