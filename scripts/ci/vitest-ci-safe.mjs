#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

function run(cmd, cmdArgs) {
  return spawnSync(cmd, cmdArgs, {
    stdio: "inherit",
    env: process.env,
    shell: false
  });
}

let result = run("pnpm", ["-s", "vitest", "run", ...args]);

if (result.error?.code === "ENOENT") {
  result = run("npx", ["-y", "vitest", "run", ...args]);
}

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
