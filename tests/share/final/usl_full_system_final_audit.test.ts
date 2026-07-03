import { describe, expect, it } from "vitest";
import fs from "node:fs";

const requiredModules = [
  "src/core/share/foundation",
  "src/core/share/experience",
  "src/core/share/relationships",
  "src/core/share/transformations",
  "src/core/share/memories",
  "src/core/share/collaboration",
  "src/core/share/sovereignty",
  "src/core/share/sync",
  "src/core/share/analytics",
  "src/core/share/trust",
  "src/core/share/connectivity",
  "src/core/share/production",
];

const requiredLocks = [
  ".lumora_usl_mega_pack_01_foundation_lock",
  ".lumora_usl_mega_pack_02_complete_lock",
  ".lumora_usl_mega_pack_03_intelligent_relationships_lock",
  ".lumora_usl_mega_pack_04_cross_portal_transformation_lock",
  ".lumora_usl_mega_pack_05_living_memories_lock",
  ".lumora_usl_mega_pack_06_collaboration_civilization_lock",
  ".lumora_usl_mega_pack_07_creator_sovereignty_lock",
  ".lumora_usl_mega_pack_08_living_synchronization_lock",
  ".lumora_usl_mega_pack_09_intelligence_analytics_lock",
  ".lumora_usl_mega_pack_10_trust_privacy_safety_lock",
  ".lumora_usl_mega_pack_11_universal_connectivity_lock",
  ".lumora_usl_mega_pack_12_production_evolution_lock",
];

describe("USL Ω∞ — Full System Final Audit", () => {
  it("contains all 12 canonical USL runtime modules", () => {
    for (const mod of requiredModules) {
      expect(fs.existsSync(mod), `${mod} missing`).toBe(true);
    }
  });

  it("contains all 12 production lock markers", () => {
    for (const lock of requiredLocks) {
      expect(fs.existsSync(lock), `${lock} missing`).toBe(true);
    }
  });

  it("exports all canonical USL layers from the share barrel", () => {
    const source = fs.readFileSync("src/core/share/index.ts", "utf8");

    for (const name of [
      "foundation",
      "experience",
      "relationships",
      "transformations",
      "memories",
      "collaboration",
      "sovereignty",
      "sync",
      "analytics",
      "trust",
      "connectivity",
      "production",
    ]) {
      expect(source).toContain(`export * from "./${name}"`);
    }
  });
});
