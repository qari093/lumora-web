import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FypFlow from "@/components/fyp/FypFlow";

describe("FYP scroll/flow behavior (smoke)", () => {
  it("renders a scroll container with overflow affordance", () => {
    render(<FypFlow />);
    const el = screen.getByTestId("fyp-scroll");
    expect(el).toBeTruthy();

    const cls = (el.getAttribute("class") || "").toLowerCase();
    const hasOverflowClass =
      cls.includes("overflow-y-auto") || cls.includes("overflow-auto") || cls.includes("overflow-scroll");

    // JSDOM may not compute styles; class-based affordance is our contract.
    expect(hasOverflowClass).toBe(true);
  });
});
