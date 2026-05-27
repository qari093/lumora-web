import { describe, expect, it } from "vitest";
import { createDailyIntegrityRoot, verifyIntegrityRoot } from "@/src/core/zenwallet/transparency/transparency";

describe("ZenWallet Pack 09 — Public Verification", () => {
  it("creates signed daily integrity root", () => {
    const root = createDailyIntegrityRoot(["ZP-AF12", "ZP-7B2D"]);
    expect(root.root).toContain("root_");
    expect(root.signature).toContain("sig_");
  });

  it("verifies pinned-key style signatures", () => {
    const root = createDailyIntegrityRoot(["ZP-1"]);
    expect(verifyIntegrityRoot(root.root, root.signature)).toBe(true);
    expect(verifyIntegrityRoot(root.root, "bad")).toBe(false);
  });
});
