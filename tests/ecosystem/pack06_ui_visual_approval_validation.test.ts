import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Ecosystem Pack 06/08", () => {
  it("ui visual approval artifact exists", () => {
    expect(fs.existsSync("data/ecosystem/pack06-ui-visual-approval-validation.json")).toBe(true);
  });

  it("ecosystem visual validation passes", () => {
    const data = JSON.parse(
      fs.readFileSync(
        "data/ecosystem/pack06-ui-visual-approval-validation.json",
        "utf8"
      )
    );

    expect(data.status).toBe("PASS");
    expect(data.visualValidation.homePagePresent).toBe(true);
    expect(data.visualValidation.portalNavigationPresent).toBe(true);
    expect(data.visualValidation.homeBeaconPresent).toBe(true);
    expect(data.visualValidation.lafsDashboardPresent).toBe(true);
    expect(data.approvalRules.ecosystemApprovalRequired).toBe(true);
  });
});
