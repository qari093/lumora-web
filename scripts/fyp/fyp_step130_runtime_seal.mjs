import fs from "node:fs";

const url = "https://lumoraverse.io/fyp?step130_runtime_seal=1";
const html = await fetch(url, { cache: "no-store" }).then(r => r.text());

const report = {
  system: "LUMORA_FYP_STEP130_RUNTIME_SEAL",
  checkedAt: new Date().toISOString(),
  status:
    html.includes('data-fyp-runtime="fullscreen-native-autoplay"') &&
    html.includes("creatorStrip") &&
    html.includes("rightRail")
      ? "PASS"
      : "FAIL"
};

fs.writeFileSync(
  "data/fyp/step130-runtime-seal.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora-audits/fyp-step130-runtime-seal.json",
  JSON.stringify(report, null, 2) + "\n"
);

fs.writeFileSync(
  ".lumora_fyp_step130_runtime_seal_lock",
  `LUMORA_FYP_STEP130_RUNTIME_SEAL=${report.status}\n`
);

console.log(JSON.stringify(report, null, 2));

if (report.status !== "PASS") process.exit(1);
