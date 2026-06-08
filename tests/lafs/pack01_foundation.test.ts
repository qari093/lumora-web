import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createLafsFoundationManifest, validateLafsFoundationManifest } from "../../src/core/lafs/foundation";

describe("LAFS Pack 01/08 foundation", () => {
  it("creates valid pre-beta foundation manifest", () => {
    const manifest = createLafsFoundationManifest(new Date("2026-06-07T00:00:00.000Z"));
    expect(validateLafsFoundationManifest(manifest)).toBe(true);
    expect(manifest.guards.paymentLiveMode).toBe(false);
    expect(manifest.guards.humanApprovalRequired).toBe(true);
    expect(manifest.accounts.length).toBeGreaterThanOrEqual(8);
  });

  it("writes foundation audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack01-foundation.json")).toBe(true);
    expect(fs.existsSync("data/lafs/foundation-manifest.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack01-foundation.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack01_foundation_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack01-foundation.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("FOUNDATION_READY");
    expect(audit.manifest.pack).toBe("01/08");
  });
});
