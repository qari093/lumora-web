import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const requiredLocks = [
  ".lumora_creator_alchemy_civilization_seal_lock",
  ".lumora_creator_hub_route_integration_lock",
  ".lumora_creator_hub_visual_shell_lock",
  ".lumora_creator_hub_runtime_activation_lock",
  ".lumora_creator_hub_live_data_wiring_fixed_lock",
  ".lumora_creator_hub_mega_pack_a_lock",
  ".lumora_creator_alchemy_pack_b_lock",
  ".lumora_creator_alchemy_pack_c_lock",
  ".lumora_creator_alchemy_pack_d_lock",
  ".lumora_creator_alchemy_pack_e_lock",
  ".lumora_creator_alchemy_phase01_pack_lock",
  ".lumora_creator_alchemy_phase02_pack_lock",
  ".lumora_creator_alchemy_phase03_pack_lock",
  ".lumora_creator_alchemy_phase04_pack_lock",
  ".lumora_creator_alchemy_phase05_pack_lock",
  ".lumora_creator_alchemy_phase06_pack_lock",
  ".lumora_creator_alchemy_phase07_pack_lock",
  ".lumora_creator_alchemy_phase08_pack_lock",
  ".lumora_creator_alchemy_phase09_pack_lock",
  ".lumora_creator_alchemy_phase10_pack_lock",
  ".lumora_creator_alchemy_phase11_pack_lock",
  ".lumora_creator_alchemy_phase12_pack_lock",
  ".lumora_creator_alchemy_post_seal_final_civilization_lock"
];

describe("Creator Alchemy Ω∞ Final Audit + Build", () => {
  it("has all required completion locks", () => {
    const missing = requiredLocks.filter((file) => !existsSync(file));
    expect(missing).toEqual([]);
  });

  it("has final readiness report", () => {
    expect(existsSync("docs/creator-alchemy/POST_SEAL_FINAL_CIVILIZATION_READINESS.json")).toBe(true);
    const report = JSON.parse(readFileSync("docs/creator-alchemy/POST_SEAL_FINAL_CIVILIZATION_READINESS.json", "utf8"));
    expect(report.status).toBe("PASS");
  });

  it("has Creator Hub runtime route and final APIs", () => {
    expect(existsSync("app/creator-hub/page.tsx")).toBe(true);
    expect(existsSync("app/api/creator-alchemy/dashboard/route.ts")).toBe(true);
    expect(existsSync("app/api/creator-alchemy/final-readiness/route.ts")).toBe(true);
    expect(existsSync("app/api/creator-alchemy/launch-readiness/route.ts")).toBe(true);
  });

  it("has dashboard visual shell connected", () => {
    const component = readFileSync("src/components/creator-alchemy/BreathingDashboard.tsx", "utf8");
    expect(component).toContain('import "./BreathingDashboard.css";');
    expect(existsSync("src/components/creator-alchemy/BreathingDashboard.css")).toBe(true);
  });
});
