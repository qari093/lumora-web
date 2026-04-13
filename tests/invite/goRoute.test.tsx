import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "@/app/go/page";

describe("Lumora invite /go route", () => {
  it("renders premium invite copy", () => {
    const html = renderToStaticMarkup(<Page />);
    expect(html).toContain("Enter Lumora");
    expect(html).toContain("Private Beta Access");
    expect(html).toContain("Open Lumora");
    expect(html).toContain("/lumora-invite.png");
  });
});
