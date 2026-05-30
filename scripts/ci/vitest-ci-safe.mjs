#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

function hasCommand(cmd) {
  const result = spawnSync("sh", ["-lc", `command -v ${cmd}`], {
    encoding: "utf8",
    stdio: "pipe"
  });
  return result.status === 0 && result.stdout.trim().length > 0;
}

const runner = hasCommand("pnpm") ? "pnpm" : "npx";
const runnerArgs = runner === "pnpm"
  ? ["-s", "vitest", "run", ...args]
  : ["-y", "vitest", "run", ...args];

const result = spawnSync(runner, runnerArgs, {
  stdio: "inherit",
  env: process.env
});

process.exit(result.status ?? 1);
