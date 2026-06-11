import fs from "fs";

const routes = [
  "app/api/fyp/feed/route.ts",
  "app/api/fyp/runtime/route.ts",
  "app/api/fyp/personalization/route.ts",
  "app/api/fyp/session/route.ts",
  "app/api/fyp/interact/route.ts"
];

const report = {
  system: "LUMORA_FYP_MEGA_PACK_C_PRESENCE_AUDIT",
  checkedAt: new Date().toISOString(),
  status: "PASS",
  checks: {}
};

for (const file of routes) {
  const ok = fs.existsSync(file);
  report.checks[file] = ok;
  if (!ok) report.status = "FAIL";
}

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync(
  "data/fyp/mega-pack-c-presence-audit.json",
  JSON.stringify(report, null, 2)
);

fs.writeFileSync(
  ".lumora-audits/fyp-mega-pack-c-presence-audit.json",
  JSON.stringify(report, null, 2)
);

if (report.status === "PASS") {
  fs.writeFileSync(
    ".lumora_fyp_mega_pack_c_presence_lock",
    "LUMORA_FYP_MEGA_PACK_C_PRESENCE=PASS\n"
  );
}

console.log(JSON.stringify(report, null, 2));

if (report.status !== "PASS") process.exit(1);
