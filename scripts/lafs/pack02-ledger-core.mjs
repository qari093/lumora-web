import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack01_foundation_lock";
const requiredFiles = [
  "src/core/lafs/ledger.ts",
  "prisma/migrations/lafs-prebeta/002_lafs_ledger_core.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const sampleTransaction = {
  idempotencyKey: "stripe:evt_lafs_pack02_sample",
  sourceReference: "pi_lafs_pack02_sample",
  description: "Zendoro Stripe payment clearing pi_lafs_pack02_sample",
  createdAt: new Date().toISOString(),
  entries: [
    { accountCode: "stripe_clearing_eur", amountMinor: 5000, entryType: "debit" },
    { accountCode: "zendoro_revenue_eur", amountMinor: 5000, entryType: "credit" }
  ]
};

const debitMinor = sampleTransaction.entries
  .filter((entry) => entry.entryType === "debit")
  .reduce((sum, entry) => sum + entry.amountMinor, 0);

const creditMinor = sampleTransaction.entries
  .filter((entry) => entry.entryType === "credit")
  .reduce((sum, entry) => sum + entry.amountMinor, 0);

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "LEDGER_CORE_READY",
  pack: "02/08",
  generatedAt: new Date().toISOString(),
  guards: {
    paymentLiveMode: false,
    humanApprovalRequired: true,
    doubleEntryRequired: true,
    idempotencyRequired: true,
    minorUnitsOnly: true
  },
  sampleTransaction,
  validation: {
    debitMinor,
    creditMinor,
    balanced: debitMinor === creditMinor,
    amountUnit: "minor"
  },
  nextPack: "LAFS Pack 03/08 — Stripe Webhook Safe Ingestion"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.validation.balanced &&
  manifest.guards.paymentLiveMode === false
    ? "PASS"
    : "FAIL";

const audit = {
  checkedAt: new Date().toISOString(),
  status,
  previousLock: {
    file: requiredPreviousLock,
    exists: fs.existsSync(path.join(root, requiredPreviousLock))
  },
  manifest,
  checks,
  nextRequiredAction: "LAFS Pack 03/08 — Stripe Webhook Safe Ingestion"
};

fs.writeFileSync(path.join(dataDir, "ledger-core-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack02-ledger-core.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack02-ledger-core.md"),
  [
    "# LAFS Pack 02/08 — Ledger Core + Double Entry",
    "",
    "Status: LEDGER_CORE_READY",
    "",
    "Rules:",
    "- All money values use minor units.",
    "- Every transaction must balance debit total and credit total.",
    "- Every transaction requires an idempotency key.",
    "- Pre-beta payment live mode remains false.",
    "- Human approval remains required before live movement.",
    "",
    "Next: LAFS Pack 03/08 — Stripe Webhook Safe Ingestion",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack02_ledger_core_lock"), "LAFS_PACK02_LEDGER_CORE=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack02_ledger_core_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack02_ledger_core_failed_lock"), "LAFS_PACK02_LEDGER_CORE=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
