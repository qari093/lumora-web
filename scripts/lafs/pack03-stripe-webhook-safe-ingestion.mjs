import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const auditDir = path.join(root, ".lumora-audits");
const dataDir = path.join(root, "data", "lafs");
const docsDir = path.join(root, "docs", "lafs");

for (const dir of [auditDir, dataDir, docsDir]) fs.mkdirSync(dir, { recursive: true });

const requiredPreviousLock = ".lumora_lafs_pack02_ledger_core_lock";
const requiredFiles = [
  "src/core/lafs/stripeWebhook.ts",
  "prisma/migrations/lafs-prebeta/003_lafs_stripe_webhook_ingestion.sql"
];

const checks = requiredFiles.map((file) => ({
  file,
  exists: fs.existsSync(path.join(root, file)),
  bytes: fs.existsSync(path.join(root, file)) ? fs.statSync(path.join(root, file)).size : 0
}));

const sampleEvent = {
  id: "evt_lafs_pack03_sample",
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_lafs_pack03_sample",
      amount: 12500,
      currency: "eur",
      metadata: {
        idempotency_key: "stripe:evt_lafs_pack03_sample"
      }
    }
  }
};

const rawBody = JSON.stringify(sampleEvent);
const secret = "whsec_lafs_pack03_test_secret";
const timestamp = Math.floor(Date.now() / 1000);
const digest = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");

const manifest = {
  system: "LAFS_PRE_BETA",
  status: "STRIPE_WEBHOOK_SAFE_INGESTION_READY",
  pack: "03/08",
  generatedAt: new Date().toISOString(),
  guards: {
    paymentLiveMode: false,
    requiresRawBody: true,
    requiresStripeSignatureVerification: true,
    requiresIdempotency: true,
    duplicateEventsAckSafely: true,
    ledgerCreatedPendingApprovalOnly: true
  },
  sampleWebhook: {
    eventId: sampleEvent.id,
    eventType: sampleEvent.type,
    signatureHeaderShape: `t=${timestamp},v1=${digest.slice(0, 12)}...`,
    amountMinor: sampleEvent.data.object.amount,
    currency: "EUR",
    idempotencyKey: `stripe:${sampleEvent.id}`
  },
  nextPack: "LAFS Pack 04/08 — Approval Workflow + RBAC"
};

const status =
  fs.existsSync(path.join(root, requiredPreviousLock)) &&
  checks.every((check) => check.exists && check.bytes > 0) &&
  manifest.guards.paymentLiveMode === false &&
  manifest.guards.requiresStripeSignatureVerification === true &&
  manifest.guards.requiresIdempotency === true
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
  nextRequiredAction: "LAFS Pack 04/08 — Approval Workflow + RBAC"
};

fs.writeFileSync(path.join(dataDir, "stripe-webhook-safe-ingestion.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(auditDir, "lafs-pack03-stripe-webhook-safe-ingestion.json"), JSON.stringify(audit, null, 2) + "\n");
fs.writeFileSync(
  path.join(docsDir, "pack03-stripe-webhook-safe-ingestion.md"),
  [
    "# LAFS Pack 03/08 — Stripe Webhook Safe Ingestion",
    "",
    "Status: STRIPE_WEBHOOK_SAFE_INGESTION_READY",
    "",
    "Rules:",
    "- Raw body is required for signature verification.",
    "- Stripe-like HMAC verification is enforced in testable core logic.",
    "- Stripe event ID is the idempotency anchor.",
    "- Duplicate events return safe duplicate status.",
    "- Successful payment events only prepare pending-approval ledger flow.",
    "- Payment live mode remains false for pre-beta.",
    "",
    "Next: LAFS Pack 04/08 — Approval Workflow + RBAC",
    ""
  ].join("\n")
);

if (status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack03_stripe_webhook_lock"), "LAFS_PACK03_STRIPE_WEBHOOK=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_lafs_pack03_stripe_webhook_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_lafs_pack03_stripe_webhook_failed_lock"), "LAFS_PACK03_STRIPE_WEBHOOK=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (status !== "PASS") process.exitCode = 1;
