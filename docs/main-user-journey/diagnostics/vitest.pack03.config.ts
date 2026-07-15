import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../../../vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: [
        "tests/runtime-consolidation/**/*.test.ts",
        "tests/runtime-consolidation/**/*.spec.ts",
        "tests/launch-readiness/phase01_route_reality.test.ts",
        "tests/launch-readiness/phase02_reality_simulation.test.ts",
        "tests/launch-readiness/phase03_persistence_state_integrity.test.ts",
        "tests/launch-readiness/phase04_api_contract_hardening.test.ts",
        "tests/auth/authEdgeCases.test.ts",
        "tests/auth/identity_final_seal.test.ts",
        "tests/auth/ecosystem_identity_contract.test.ts",
        "tests/launch/command_surfaces_matrix.test.ts"
      ],
      exclude: [
        "**/node_modules/**",
        "**/.pnpm/**",
        "**/.next/**",
        "**/.vercel/**",
        "**/backups/**",
        "**/.quarantine/**",
        "**/.disabled_routes/**",
        "**/src/_app_disabled_*/**"
      ],
      passWithNoTests: false
    }
  })
);
