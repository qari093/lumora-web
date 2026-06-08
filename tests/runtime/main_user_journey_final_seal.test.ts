import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("main user journey final seal", () => {
  it("writes final seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/main-user-journey-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_main_user_journey_validated_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/main-user-journey-final-seal.md")).toBe(true);
  });

  it("seals main journey and points to Zendoro payment validation", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/main-user-journey-final-seal.json", "utf8"));
    expect(seal.status).toBe("MAIN_USER_JOURNEY_VALIDATED");
    expect(seal.checks.routeMatrix).toBe("PASS");
    expect(seal.checks.apiContracts).toBe("PASS");
    expect(seal.checks.productionGuards).toBe("PASS");
    expect(seal.nextCanonicalPhase).toBe("Validate Zendoro payments");
  });
});
