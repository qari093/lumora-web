import { describe, expect, it } from "vitest";

import { validateFeedDiversityInput } from "@/src/core/fyp/diversity/contracts/feedDiversityContract";
import { calculateFeedDiversity } from "@/src/core/fyp/diversity/runtime/feedDiversityScore";
import { runFeedDiversityRuntime } from "@/src/core/fyp/diversity/runtime/feedDiversityRuntime";

describe(
  "Lumora FYP Feed Diversity Runtime Activation",
  () => {
    const items = [
      {
        id: "1",
        lane: "movies" as const,
        score: 90
      },
      {
        id: "2",
        lane: "music" as const,
        score: 80
      },
      {
        id: "3",
        lane: "gaming" as const,
        score: 70
      },
      {
        id: "4",
        lane: "movies" as const,
        score: 60
      }
    ];

    it("validates feed diversity input", () => {
      expect(
        validateFeedDiversityInput(items)
      ).toBe(true);
    });

    it("calculates diversity scores", () => {
      const results = calculateFeedDiversity(items);

      expect(results.length).toBe(3);
    });

    it("tracks lane distribution", () => {
      const results = calculateFeedDiversity(items);

      const movies = results.find(
        (item) => item.lane === "movies"
      );

      expect(movies?.count).toBe(2);
    });

    it("creates diversity score", () => {
      const results = calculateFeedDiversity(items);

      expect(results[0].score).toBeGreaterThan(0);
    });

    it("runs feed diversity runtime", () => {
      const runtime = runFeedDiversityRuntime(items);

      expect(runtime.active).toBe(true);
      expect(runtime.results.length).toBe(3);
    });
  }
);
