import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath =
  "docs/audit/lumora_gap_mega_pack_09_deployment_beta_final_seal.json";

describe("Lumora Gap Mega Pack 09 deployment beta final seal", () => {
  it("creates final seal report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it("seals all previous gap packs", () => {
    const seal = JSON.parse(fs.readFileSync(jsonPath,"utf8"));

    expect(seal.status).toBe("SEALED_WITH_MANUAL_DEPLOYMENT_REQUIREMENTS");
    expect(seal.readiness.allGapReportsPresent).toBe(true);
    expect(seal.readiness.allGapReportsAccepted).toBe(true);
    expect(seal.readiness.allLocksPresent).toBe(true);
  });

  it("documents manual deployment requirements", () => {
    const seal = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    const warnings = seal.warnings.join(" ");

    expect(warnings).toContain("Vercel deployment");
    expect(warnings).toContain("Stripe sandbox checkout");
    expect(warnings).toContain("Auth provider wiring");
    expect(warnings).toContain("Private beta");
  });
});
