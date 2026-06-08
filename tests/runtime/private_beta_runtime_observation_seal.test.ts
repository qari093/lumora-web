import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta runtime observation seal", () => {
  it("writes runtime observation seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/runtime-observation-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-runtime-observation-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-runtime-observation-seal.md")).toBe(true);
  });

  it("seals runtime observation conservatively", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/runtime-observation-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_RUNTIME_OBSERVATION_SEALED");
    expect(Object.values(seal.checks).every((v) => v === "PASS")).toBe(true);
    expect(seal.runtime.critical5xx).toBe(0);
    expect(seal.runtime.unauthorizedAccessEvents).toBe(0);
    expect(seal.runtime.paymentLiveMode).toBe(false);
    expect(seal.runtime.publicSignupEnabled).toBe(false);
    expect(seal.runtime.allowlistOnly).toBe(true);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.nextCanonicalPhase).toBe("Private beta final completion seal");
  });
});
