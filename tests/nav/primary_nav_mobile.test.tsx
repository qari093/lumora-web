import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrimaryNav from "@/components/nav/PrimaryNav";

describe("PrimaryNav (mobile behavior)", () => {
  it("renders all active portal labels", () => {
    render(<PrimaryNav />);
    const labels = ["FYP", "GMAR", "NEXA", "Videos", "Movies", "Celebrations", "Share", "Live"];
    labels.forEach(label => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });
});
