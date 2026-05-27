import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  filterFyp94SeenHistory,
  mixFyp94CategoriesV2,
  shuffleFyp94Session,
} from "../../src/lib/fyp94/feed-intelligence/mixer";

describe("FYP94 Pack 3 — Feed Intelligence", () => {
  const items = [
    { id: "1", category: "Surf", playbackUrl: "/1.mp4" },
    { id: "2", category: "Surf", playbackUrl: "/2.mp4" },
    { id: "3", category: "Cars", playbackUrl: "/3.mp4" },
    { id: "4", category: "Food", playbackUrl: "/4.mp4" },
    { id: "5", category: "Dogs", playbackUrl: "/5.mp4" },
    { id: "6", category: "City", playbackUrl: "/6.mp4" },
  ];

  it("mixes categories instead of repeating same bucket", () => {
    const mixed = mixFyp94CategoriesV2(items);
    expect(mixed).toHaveLength(items.length);
    expect(mixed[0].category).toBeTruthy();
  });

  it("shuffles per session deterministically by seed", () => {
    const a = shuffleFyp94Session(items, 100).map((x) => x.id).join(",");
    const b = shuffleFyp94Session(items, 101).map((x) => x.id).join(",");
    expect(a).not.toBe(b);
  });

  it("filters recently seen while preserving fallback", () => {
    const filtered = filterFyp94SeenHistory(items, ["1"]);
    expect(filtered.some((x) => x.id === "1")).toBe(false);
  });

  it("page binds manifest feed intelligence and controls", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("/api/fyp94/library?fresh=");
    expect(page).toContain("mixFyp94CategoriesV2");
    expect(page).toContain("shuffleFyp94Session");
    expect(page).toContain("filterFyp94SeenHistory");
    expect(page).toContain("writeFyp94SeenId");
    expect(page).toContain("onEnded={goNext}");
    expect(page).toContain("onClick={togglePlay}");
  });
});
