import fs from "node:fs";

const requiredFiles = [
  "app/fyp",
  "app/lumaspace/page.tsx",
  "app/share/page.tsx",
  "app/api/video-ingestion/validation-pool/route.ts",
  "app/api/video-ingestion/runtime/fyp-smoke/route.ts",
  "app/api/video-ingestion/runtime/lumaspace-smoke/route.ts",
  "app/api/video-ingestion/runtime/final-certification/route.ts",
  ".lumora_video_ingestion_foundation_lock",
  ".lumora_validation_media_pool_route_lock",
];

const checks = requiredFiles.map((path) => ({
  path,
  exists: fs.existsSync(path),
}));

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const hasPlaywright = Boolean(deps["@playwright/test"] || deps.playwright);

console.log(JSON.stringify({
  ok: checks.every((check) => check.exists),
  hasPlaywright,
  checks,
  next: hasPlaywright
    ? "REAL_BROWSER_PLAYWRIGHT_SMOKE"
    : "INSTALL_OR_USE_EXISTING_BROWSER_SMOKE_TOOL",
}, null, 2));

if (!checks.every((check) => check.exists)) process.exit(1);
