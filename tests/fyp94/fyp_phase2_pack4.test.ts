import { describe, it, expect } from "vitest";
import {
  detectCategory,
  attachCategory,
  applyCategoryBalance,
  balanceCategories
} from "../../scripts/fyp94/category_balance.mjs";

describe("Phase 2 Pack 4 — Category Balance", () => {
  it("detects categories from query", () => {
    expect(detectCategory("football match")).toBe("sports");
    expect(detectCategory("city street night")).toBe("urban");
    expect(detectCategory("kids playing")).toBe("people");
  });

  it("attaches category field", () => {
    const out = attachCategory([{ query: "festival crowd" }]);
    expect(out[0].category).toBe("events");
  });

  it("limits per-category dominance", () => {
    const clips = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      query: "football match",
      category: "sports"
    }));

    const out = balanceCategories(clips, 8);
    expect(out.length).toBe(8);
  });

  it("ensures multi-category spread", () => {
    const out = applyCategoryBalance([
      { query: "football match" },
      { query: "city street" },
      { query: "kids playing" },
      { query: "ocean waves" }
    ]);

    const cats = new Set(out.map(x => x.category));
    expect(cats.size).toBeGreaterThanOrEqual(3);
  });
});
