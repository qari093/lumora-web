import { describe, it, expect } from "vitest";
import fs from "fs";

describe("wallet stripe redirect contract", () => {
  it("wallet page reads stripe query param and has success/cancel banners", () => {
    const p = "app/wallet/page.tsx";
    const s = fs.readFileSync(p, "utf8");

    // Must read query param
    expect(s).toContain('params.get("stripe")');

    // Must render success + cancel messaging (tokens, not exact UI)
    expect(s).toMatch(/stripeStatus\s*===\s*["']success["']/);
    expect(s).toMatch(/stripeStatus\s*===\s*["']cancel["']/);

    // Must refresh shortly after success
    expect(s).toMatch(/setTimeout\(/);
    expect(s).toMatch(/2500/);
  });
});
