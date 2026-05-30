#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

console.log("[vitest-ci-safe] runner=v2-direct-pnpm");
console.log("[vitest-ci-safe] args=" + JSON.stringify(args));

const result = spawnSync("pnpm", ["-s", "vitest", "run", ...args], {
  stdio: "inherit",
  env: process.env,
  shell: false
});

if (result.error) {
  console.error("[vitest-ci-safe] spawn-error", result.error);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
