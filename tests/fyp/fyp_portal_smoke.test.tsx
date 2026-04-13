import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "@/app/fyp/page";

describe("FYP portal smoke", () => {
  it("renders visible starter feed cards", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          ok: true,
          source: "fallback",
          items: [
            { id: "feed-1", title: "Lumora Welcome Drop", creator: "Lumora", category: "Launch" },
            { id: "feed-2", title: "GMAR Highlight Seed", creator: "GMAR", category: "Games" },
            { id: "feed-3", title: "CineVerse Discovery Seed", creator: "CineVerse", category: "Movies" },
          ],
        }),
      }))
    );

    const html = renderToStaticMarkup(<Page />);
    expect(html).toContain("Lumora Feed");
    expect(html).toContain("Lumora Welcome Drop");
    expect(html).toContain("GMAR Highlight Seed");
    expect(html).toContain("CineVerse Discovery Seed");
    expect(html).toContain("3 items");

    vi.unstubAllGlobals();
  });
});
