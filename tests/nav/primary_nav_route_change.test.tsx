import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrimaryNav from "@/components/nav/PrimaryNav";

describe("PrimaryNav route behavior (Next.js Link)", () => {
  it("renders correct href attributes for all active portals", () => {
    render(<PrimaryNav />);

    const expectedRoutes = [
      { label: "FYP", route: "/fyp" },
      { label: "GMAR", route: "/gmar" },
      { label: "NEXA", route: "/nexa" },
      { label: "Videos", route: "/videos" },
      { label: "Movies", route: "/movies" },
      { label: "Celebrations", route: "/celebrations" },
      { label: "Share", route: "/share" },
      { label: "Live", route: "/live" },
    ];

    expectedRoutes.forEach(({ label, route }) => {
      const link = screen.getByRole("link", { name: label });
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe(route);
    });
  });
});
