import fs from "fs";

const p = "data/ecosystem/pack03-portal-integration-validation.json";
const j = JSON.parse(fs.readFileSync(p,"utf8"));

if (j.status !== "PASS") process.exit(1);

console.log(JSON.stringify({
  ok: true,
  pack: "03/08",
  phase: j.phase
}, null, 2));
