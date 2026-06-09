import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const dirs = [
  ".lumora-audits",
  "data/ecosystem",
  "docs/ecosystem"
];

for (const dir of dirs) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

const requiredLockFiles = [
  "data/private-beta/beta-start-authorization.json",
  "data/private-beta/wave-1-execution-lock.json",
  "data/private-beta/pre-invite-readiness-seal.json",
  "data/private-beta/final-pre-tester-validation.json"
];

const requiredPages = [
  { key: "home", route: "/", file: "app/page.tsx", required: true },
  { key: "lafs", route: "/lafs", file: "app/lafs/page.tsx", required: true },
  { key: "go", route: "/go", file: "app/go/page.tsx", required: true },
  { key: "beta", route: "/beta", file: "app/beta/page.tsx", required: true },
  { key: "privateAccess", route: "/private-access", file: "app/private-access/page.tsx", required: true },

  { key: "fyp", route: "/fyp", file: "app/fyp/page.tsx", required: true },
  { key: "live", route: "/live", file: "app/live/page.tsx", required: true },
  { key: "gmar", route: "/gmar", file: "app/gmar/page.tsx", required: true },
  { key: "nexa", route: "/nexa", file: "app/nexa/page.tsx", required: true },
  { key: "zendoro", route: "/zendoro", file: "app/zendoro/page.tsx", required: true },
  { key: "wallet", route: "/wallet", file: "app/wallet/page.tsx", required: true },

  { key: "lumaspace", route: "/lumaspace", file: "app/lumaspace/page.tsx", required: false },
  { key: "movies", route: "/movies", file: "app/movies/page.tsx", required: false },
  { key: "music", route: "/music", file: "app/music/page.tsx", required: false },
  { key: "creator", route: "/creator", file: "app/creator/page.tsx", required: false },
  { key: "share", route: "/share", file: "app/share/page.tsx", required: false },
  { key: "profile", route: "/profile", file: "app/profile/page.tsx", required: false },
  { key: "settings", route: "/settings", file: "app/settings/page.tsx", required: false }
];

function fileInfo(file) {
  const full = path.join(root, file);
  const exists = fs.existsSync(full);
  return {
    file,
    exists,
    bytes: exists ? fs.statSync(full).size : 0
  };
}

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return null;
  }
}

const lockChecks = requiredLockFiles.map((file) => {
  const info = fileInfo(file);
  return {
    ...info,
    jsonValid: info.exists ? Boolean(readJsonSafe(file)) : false
  };
});

const pageChecks = requiredPages.map((page) => {
  const info = fileInfo(page.file);
  return {
    ...page,
    ...info,
    ok: page.required ? info.exists && info.bytes > 0 : true
  };
});

const betaAuthorization = readJsonSafe("data/private-beta/beta-start-authorization.json");

const guards = {
  ecosystemApprovalRequired: betaAuthorization?.requiredBeforeTesters === "FULL_ECOSYSTEM_APPROVAL_BY_WAQAR",
  testerSelectionBlocked: betaAuthorization?.testerSelectionAllowed === false,
  inviteIssuanceBlocked: betaAuthorization?.inviteIssuanceAllowed === false,
  internalValidationOnly: betaAuthorization?.authorizedAction === "CONTINUE_INTERNAL_ECOSYSTEM_VALIDATION_ONLY"
};

const requiredPagesOk = pageChecks.filter((p) => p.required).every((p) => p.ok);
const optionalPagesPresent = pageChecks.filter((p) => !p.required && p.exists).length;
const locksOk = lockChecks.every((item) => item.exists && item.bytes > 0 && item.jsonValid);
const guardsOk = Object.values(guards).every(Boolean);

const manifest = {
  system: "LUMORA_ECOSYSTEM_APPROVAL",
  pack: "01/08",
  status: requiredPagesOk && locksOk && guardsOk ? "ECOSYSTEM_SURFACE_VALIDATION_READY" : "ECOSYSTEM_SURFACE_VALIDATION_BLOCKED",
  generatedAt: new Date().toISOString(),
  phase: "Ecosystem Surface Validation",
  scope: [
    "Ecosystem approval gate lock",
    "Global portal surface audit",
    "Primary route file audit",
    "Beta entry surface audit",
    "LAFS surface audit",
    "Invite/tester block verification"
  ],
  guards,
  summary: {
    requiredPagesTotal: pageChecks.filter((p) => p.required).length,
    requiredPagesOk,
    optionalPagesPresent,
    locksOk,
    guardsOk
  },
  requiredLocks: lockChecks,
  pages: pageChecks,
  nextPack: "Pack 02/08 — Runtime & API Validation"
};

const audit = {
  checkedAt: new Date().toISOString(),
  status: manifest.status === "ECOSYSTEM_SURFACE_VALIDATION_READY" ? "PASS" : "FAIL",
  manifest,
  nextRequiredAction: manifest.nextPack
};

fs.writeFileSync(
  path.join(root, "data/ecosystem/pack01-surface-validation.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(root, ".lumora-audits/ecosystem-pack01-surface-validation.json"),
  JSON.stringify(audit, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(root, "docs/ecosystem/pack01-surface-validation.md"),
  [
    "# Ecosystem Pack 01/08 — Surface Validation",
    "",
    `Status: ${manifest.status}`,
    "",
    "Validated:",
    "- Ecosystem approval gate exists.",
    "- Tester selection remains blocked.",
    "- Invite issuance remains blocked.",
    "- Required portal pages exist.",
    "- LAFS surface exists.",
    "- Beta/private access surfaces exist.",
    "",
    "Required route files:",
    ...pageChecks.filter((p) => p.required).map((p) => `- ${p.route} → ${p.file} → ${p.ok ? "PASS" : "FAIL"}`),
    "",
    "Optional route files present:",
    ...pageChecks.filter((p) => !p.required && p.exists).map((p) => `- ${p.route} → ${p.file}`),
    "",
    `Next: ${manifest.nextPack}`,
    ""
  ].join("\n")
);

if (audit.status === "PASS") {
  fs.writeFileSync(path.join(root, ".lumora_ecosystem_pack01_surface_validation_lock"), "ECOSYSTEM_PACK01_SURFACE_VALIDATION=PASS\n");
  try { fs.unlinkSync(path.join(root, ".lumora_ecosystem_pack01_surface_validation_failed_lock")); } catch {}
} else {
  fs.writeFileSync(path.join(root, ".lumora_ecosystem_pack01_surface_validation_failed_lock"), "ECOSYSTEM_PACK01_SURFACE_VALIDATION=FAIL\n");
}

console.log(JSON.stringify(audit, null, 2));
if (audit.status !== "PASS") process.exitCode = 1;
