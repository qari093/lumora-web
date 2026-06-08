import fs from "node:fs";

const requiredLocks = [
  ".lumora_runtime_consolidation_phase1_lock",
  ".lumora_fix_duplicate_legacy_routes_lock",
  ".lumora_main_user_journey_validated_lock",
  ".lumora_zendoro_payments_validated_lock",
  ".lumora_live_fyp_validated_lock"
];

const routes = [
  "app/api/private-beta/access/route.ts",
  "app/api/private-beta/gate/route.ts",
  "app/api/private-beta/allowlist/route.ts",
  "app/api/private-access/route.ts",
  "app/private-access/page.tsx",
  "app/beta/page.tsx",
  "app/go/page.tsx"
];

const lockResults = requiredLocks.map((file) => ({
  file,
  exists: fs.existsSync(file)
}));

const routeResults = routes.map((file) => ({
  file,
  exists: fs.existsSync(file),
  bytes: fs.existsSync(file) ? fs.statSync(file).size : 0
}));

const status =
  lockResults.every((r) => r.exists) &&
  routeResults.every((r) => r.exists && r.bytes > 0)
    ? "PASS"
    : "FAIL";

const report = {
  checkedAt: new Date().toISOString(),
  status,
  requiredLocks: lockResults,
  privateBetaRoutes: routeResults,
  nextRequiredAction: "private beta production access smoke"
};

fs.writeFileSync(".lumora-audits/private-beta-readiness-gate.json", JSON.stringify(report, null, 2) + "\n");

fs.writeFileSync(
  "docs/runtime/private-beta-readiness-gate.md",
  [
    "# Private Beta Readiness Gate",
    "",
    `Status: ${status}`,
    "",
    "Required locks:",
    ...lockResults.map((r) => `- ${r.exists ? "PASS" : "FAIL"} ${r.file}`),
    "",
    "Private beta routes:",
    ...routeResults.map((r) => `- ${r.exists && r.bytes > 0 ? "PASS" : "FAIL"} ${r.file}`)
  ].join("\n") + "\n"
);

console.log(JSON.stringify(report, null, 2));
process.exitCode = status === "PASS" ? 0 : 1;
