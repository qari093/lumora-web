import fs from "fs";

const report = { ok: true, issues: [] };
const log = (i)=>{ report.issues.push(i); if (i.severity==="high"||i.severity==="critical") report.ok=false; };

const mustExist = [
  "src/app/gmar/aaa-game/page.tsx",
  "src/components/gmar/GameEngine.tsx",
  "src/lib/gmar/store.ts",
  "src/lib/cc/tower.ts"
];
for (const f of mustExist) if (!fs.existsSync(f)) log({ id:`missing:${f}`, severity:"high", area:"game", message:`Missing required file: ${f}` });

try {
  const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
  if (!pkg.dependencies || !pkg.dependencies.howler) log({ id:"dep:howler", severity:"medium", area:"deps", message:"howler not found in dependencies" });
} catch(e) {
  log({ id:"pkg:read", severity:"high", area:"deps", message:"Unable to read package.json", meta:{e:String(e)} });
}

fs.writeFileSync("cc-tower-report.json", JSON.stringify(report,null,2));
if (!report.ok) { console.error("CC Tower found blocking issues."); process.exit(2); }
console.log("CC Tower scan completed.");
