import { spawnSync } from "node:child_process";

const result = spawnSync(
  "npx",
  ["tsx", "scripts/fyp_movie_clips/run_live_movie_ingestion.ts"],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
