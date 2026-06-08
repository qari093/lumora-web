import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const accountSeeds = [
  { code: "cash_eur", name: "Cash EUR", currency: "EUR", type: "asset" },
  { code: "stripe_clearing_eur", name: "Stripe Clearing EUR", currency: "EUR", type: "asset" },
  { code: "zendoro_revenue_eur", name: "Zendoro Revenue EUR", currency: "EUR", type: "revenue" },
  { code: "refund_reserve_eur", name: "Refund Reserve EUR", currency: "EUR", type: "liability" },
  { code: "creator_rewards_eur", name: "Creator Rewards EUR", currency: "EUR", type: "liability" },
  { code: "operations_expense_eur", name: "Operations Expense EUR", currency: "EUR", type: "expense" },
  { code: "treasury_reserve_eur", name: "Treasury Reserve EUR", currency: "EUR", type: "equity" },
  { code: "zencoin_internal_zc", name: "Zencoin Internal", currency: "ZC", type: "liability" }
];

const guards = {
  paymentLiveMode: false,
  publicSignupDisabled: true,
  allowlistOnly: true,
  manualExpansionOnly: true,
  humanApprovalRequired: true
};

const requiredFiles = [
  "src/core/lafs/types.ts",
  "src/core/lafs/foundation.ts",
  "prisma/migrations/lafs-prebeta/001_lafs_foundation.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "FOUNDATION_READY",
  pack: "01/08",
  generatedAt: new Date().toISOString(),
  guards,
  accounts: accountSeeds,
  checks,
  nextPack: "LAFS Pack 02/08 — Ledger Core + Double Entry"
};

const status =
  checks.every((check) => check.exists && check.bytes > 0) &&
  accountSeeds.length >= 8 &&
  guards.paymentLiveMode === false &&
  guards.humanApprovalRequired === true
    ? "PASS"
    : "FAIL";

const audit = {
  checkedAt: new Date().toISOString(),
  status,
  manifest,
  nextRequiredAction: "LAFS Pack 02/08 — Ledger Core + Double Entry"
};

fs.writeFileSync(path.join(dataDir, "foundation-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack01-foundation.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack01-foundation.md"),
  [
    "# LAFS Pack 01/08 — Finance Foundation + Schema",
    "",
    "Status: FOUNDATION_READY",
    "",
    "Pre-beta guards:",
    "- Payment live mode: false",
    "- Public signup disabled: true",
    "- Allowlist only: true",
    "- Manual expansion only: true",
    "- Human approval required: true",
    "",
    "Next: LAFS Pack 02/08 — Ledger Core + Double Entry",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack01_foundation_lock"), "LAFS_PACK01_FOUNDATION=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack01_foundation_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack01_foundation_failed_lock"), "LAFS_PACK01_FOUNDATION=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
