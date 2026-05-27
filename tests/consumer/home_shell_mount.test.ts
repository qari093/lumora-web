import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Lumora consumer home shell mount", () => {
  it("mounts the consumer shell on app/page.tsx", () => {
    const page = fs.readFileSync("app/page.tsx", "utf8");
    expect(page).toContain("LumoraConsumerHome");
  });

  it("contains premium portal links", () => {
    const shell = fs.readFileSync("components/consumer/LumoraConsumerHome.tsx", "utf8");
    expect(shell).toContain("/fyp");
    expect(shell).toContain("/live");
    expect(shell).toContain("/gmar");
    expect(shell).toContain("/nexa");
    expect(shell).toContain("/cineverse");
  });
});
