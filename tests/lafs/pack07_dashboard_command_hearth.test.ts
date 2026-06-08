import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createLafsCommandHearthModel, createLafsDashboardSnapshot } from "../../src/core/lafs/dashboard";

describe("LAFS Pack 07/08 dashboard command hearth", () => {
  it("creates read-only dashboard snapshot", () => {
    const snapshot = createLafsDashboardSnapshot();

    expect(snapshot.status).toBe("LAFS_COMMAND_HEARTH_READY");
    expect(snapshot.paymentLiveMode).toBe(false);
    expect(snapshot.lensDefault).toBe("OFF");
    expect(snapshot.guards.readOnlyDashboard).toBe(true);
    expect(snapshot.guards.noMoneyMovementFromDashboard).toBe(true);
    expect(snapshot.panels.length).toBeGreaterThanOrEqual(8);
  });

  it("creates command hearth model with constitution", () => {
    const model = createLafsCommandHearthModel();

    expect(model.layout.title).toContain("LAFS");
    expect(model.layout.lumoraLens.default).toBe("OFF");
    expect(model.layout.lumoraLens.blockedFromCriticalPanels).toBe(true);
    expect(model.constitution.status).toBe("FINANCIAL_CONSTITUTION_ACTIVE");
  });

  it("writes dashboard audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack07-dashboard-command-hearth.json")).toBe(true);
    expect(fs.existsSync("data/lafs/dashboard-command-hearth.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack07-dashboard-command-hearth.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack07_dashboard_command_hearth_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack07-dashboard-command-hearth.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("DASHBOARD_COMMAND_HEARTH_READY");
    expect(audit.manifest.guards.noMoneyMovementFromDashboard).toBe(true);
  });
});
