import { describe, expect, it } from "vitest";
import {
  addReview,
  getAverageRating,
  getVerifiedRatio,
} from "@/src/lib/zendoro/trust/reviewRuntime";

describe("Zendoro Pack 7/12 — Trust + Reviews", () => {
  it("stores reviews", () => {
    const review = addReview(5, true);

    expect(review.rating).toBe(5);
  });

  it("computes average rating", () => {
    addReview(4);
    addReview(5);

    expect(getAverageRating()).toBeGreaterThan(0);
  });

  it("computes verified ratio", () => {
    addReview(5, true);

    expect(getVerifiedRatio()).toBeGreaterThan(0);
  });
});
