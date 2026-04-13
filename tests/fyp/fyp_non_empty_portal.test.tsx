import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "@/app/fyp/page";

describe("FYP non-empty portal", () => {
  it("renders a non-empty starter feed shell", () => {
    vi.stubGlobal("fetch", vi.fn());
    const html = renderToStaticMarkup(<Page />);
    expect(html).toContain("Lumora Feed");
    expect(html).toContain("Lumora Welcome Drop");
    expect(html).toContain("GMAR Highlight Seed");
    expect(html).toContain("CineVerse Discovery Seed");
    expect(html).toContain("3 items");
    vi.unstubAllGlobals();
  });
});
