import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

const result = spawnSync("pnpm", ["-s", "vitest", "run", ...args], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    CI: "true",
    VITEST_POOL_ID: "1",
    VITEST_MAX_THREADS: "1",
    VITEST_MIN_THREADS: "1",
  },
});

process.exit(result.status ?? 1);
