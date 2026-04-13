import { describe, expect, it } from "vitest";
import fs from "node:fs";

const BASE = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3001";

describe("home http smoke", () => {
  it("responds 200 for / and exposes home hub shell", async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("Portal Hub")).toBe(true);
    expect(html.includes("Lumora")).toBe(true);
  });

  it("home hub component includes readiness + overview + portal bindings", () => {
    const component = fs.readFileSync("components/home/HomePortalHub.tsx", "utf8");

    for (const snippet of [
      'fetch("/api/launch/readiness"',
      'fetch("/api/portal-overview"',
      'fetch("/api/portal-cards"',
      'data-home-readiness="ready"',
      'data-home-overview="ready"',
      'data-home-portal-key={card.key}',
      'data-home-portal-status={card.status}',
      'Portal Hub',
    ]) {
      expect(component.includes(snippet)).toBe(true);
    }
  });
});
