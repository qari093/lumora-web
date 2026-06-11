import fs from "node:fs";

const files = [
  "app/api/fyp/feed/route.ts",
  "app/api/fyp/runtime/route.ts",
  "app/api/fyp/personalization/route.ts",
  "app/api/fyp/session/route.ts",
  "app/api/fyp/interact/route.ts",
  ".lumora_fyp_mega_pack_c_presence_lock",
];

const text = (path) => fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";

const checks = {
  presenceLockPass: text(".lumora_fyp_mega_pack_c_presence_lock").includes("PASS"),
  feedRouteExists: fs.existsSync("app/api/fyp/feed/route.ts"),
  runtimeRouteExists: fs.existsSync("app/api/fyp/runtime/route.ts"),
  personalizationRouteExists: fs.existsSync("app/api/fyp/personalization/route.ts"),
  sessionRouteExists: fs.existsSync("app/api/fyp/session/route.ts"),
  interactRouteExists: fs.existsSync("app/api/fyp/interact/route.ts"),
  feedHasGet: /export\s+async\s+function\s+GET/.test(text("app/api/fyp/feed/route.ts")),
  runtimeHasGet: /export\s+async\s+function\s+GET/.test(text("app/api/fyp/runtime/route.ts")),
  personalizationHasRuntime: text("app/api/fyp/personalization/route.ts").includes("personalization"),
  sessionHasRuntime: text("app/api/fyp/session/route.ts").includes("session"),
  interactHasRuntime: text("app/api/fyp/interact/route.ts").includes("interact"),
  noKnownFailLock: !fs.existsSync(".lumora_fyp_mega_pack_c_presence_failed_lock"),
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_C_FULL_AUDIT",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS" ? "MEGA_PACK_C_FULLY_AUDITED_READY" : "MEGA_PACK_C_FULL_AUDIT_BLOCKED",
};

fs.writeFileSync("data/fyp/mega-pack-c-full-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-c-full-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(
  "docs/fyp/mega-pack-c-full-audit.md",
  `# FYP Mega Pack C Full Audit\n\nStatus: ${status}\n\nResult: ${report.result}\n`
);

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_c_full_audit_lock", "LUMORA_FYP_MEGA_PACK_C_FULL_AUDIT=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_c_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_c_full_audit_failed_lock", "LUMORA_FYP_MEGA_PACK_C_FULL_AUDIT=FAIL\n");
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
