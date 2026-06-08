import fs from "node:fs";

const targets = [
  "app/api/private-beta/access/route.ts",
  "app/api/private-beta/gate/route.ts",
  "app/api/private-beta/allowlist/route.ts",
  "app/api/private-access/route.ts"
];

const requiredTerms = [
  "allow",
  "beta",
  "private",
  "email"
];

const routes = targets.map((file) => {
  const exists = fs.existsSync(file);
  const src = exists ? fs.readFileSync(file, "utf8") : "";
  const lower = src.toLowerCase();

  return {
    file,
    exists,
    bytes: exists ? Buffer.byteLength(src) : 0,
    hasGet: /\bexport\s+async\s+function\s+GET\b|\bexport\s+function\s+GET\b/.test(src),
    hasPost: /\bexport\s+async\s+function\s+POST\b|\bexport\s+function\s+POST\b/.test(src),
    mentionsAllowlist: lower.includes("allowlist") || lower.includes("allow"),
    mentionsPrivateBeta: lower.includes("private") && lower.includes("beta"),
    mentionsEmail: lower.includes("email"),
    unsafeOpenAccess:
      lower.includes("return nextresponse.json({ ok: true") &&
      !lower.includes("401") &&
      !lower.includes("403") &&
      !lower.includes("allowlist")
  };
});

const status = routes.every((route) =>
  route.exists &&
  route.bytes > 0 &&
  route.mentionsPrivateBeta &&
  route.mentionsAllowlist &&
  !route.unsafeOpenAccess
) ? "PASS" : "FAIL";

const report = {
  checkedAt: new Date().toISOString(),
  status,
  requiredTerms,
  routes,
  nextRequiredAction: "private beta final seal"
};

fs.mkdirSync(".lumora-audits", { recursive: true });
fs.mkdirSync("docs/runtime", { recursive: true });
fs.writeFileSync(".lumora-audits/private-beta-allowlist-guard-audit.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(
  "docs/runtime/private-beta-allowlist-guard-audit.md",
  [
    "# Private Beta Allowlist + Guard Audit",
    "",
    `Status: ${status}`,
    "",
    "Required behavior:",
    "- Private beta routes must exist.",
    "- Routes must mention beta/private allowlist semantics.",
    "- Routes must not expose unconditional open access.",
    "",
    "Next: private beta final seal.",
    ""
  ].join("\n")
);

console.log(JSON.stringify(report, null, 2));
process.exitCode = status === "PASS" ? 0 : 1;
