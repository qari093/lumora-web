import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Creator dashboard clickable UI", () => {
  it("uses client component and interactive handlers", () => {
    const page = fs.readFileSync("app/creator/dashboard/page.tsx", "utf8");
    const client = fs.readFileSync("components/creator-dashboard/CreatorDashboardClient.tsx", "utf8");

    expect(page).toContain("CreatorDashboardClient");
    expect(client).toContain('"use client"');
    expect(client).toContain("onClick");
    expect(client).toContain("setTab");
    expect(client).toContain("Silent Ovation");
    expect(client).toContain("Next Circle: queued for the daily Anchor Circle");
  });
});
