import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FypFlow from "@/components/fyp/FypFlow";
import { VARIANTS, computeVariantForToday } from "@/components/fyp/variants";

describe("FYP engagement baseline (locked)", () => {
  it("renders a scroll container and at least 3 cards", () => {
    render(<FypFlow />);
    const scroll = screen.getByTestId("fyp-scroll");
    expect(scroll).toBeTruthy();

    const cards = screen.getAllByTestId("fyp-card");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("renders the repeat-session alive marker", () => {
    render(<FypFlow />);
    const marker = document.getElementById("LUMORA_FYP_REPEAT_VARIATION");
    expect(marker).toBeTruthy();
  });

  it("variant computation returns only allowed keys and is deterministic per (seed+day)", () => {
    const seed = "seed_test_user_123";
    const day = "2026-02-13";
    const v1 = computeVariantForToday(seed, day);
    const v2 = computeVariantForToday(seed, day);
    expect(v1).toBe(v2);

    const allowed = new Set(Object.keys(VARIANTS));
    expect(allowed.has(v1)).toBe(true);
  });
});
