import fs from "node:fs";
import path from "node:path";

function die(msg){ console.error(msg); process.exit(1); }

const root = process.cwd();
const exPath = path.join(root, ".env.example");
if (!fs.existsSync(exPath)) die("env_example_missing");

const raw = fs.readFileSync(exPath, "utf8").replace(/\r\n/g, "\n");
const req = [];
const opt = [];
for (const line of raw.split("\n")) {
  const s = line.trim();
  if (!s || s.startsWith("#")) continue;
  // allow "export KEY=..."
  const noExport = s.startsWith("export ") ? s.slice("export ".length).trim() : s;
  const eq = noExport.indexOf("=");
  if (eq <= 0) continue;
  const key = noExport.slice(0, eq).trim();
  const val = noExport.slice(eq + 1).trim();
  if (!/^[A-Z0-9_]+$/.test(key)) continue;

  // Convention:
  // - If value is empty OR "REQUIRED" OR "CHANGEME" -> required
  // - If value is "OPTIONAL" or has a non-empty default -> optional
  const v = val.replace(/^['"]|['"]$/g, "");
  const upper = v.toUpperCase();
  if (v === "" || upper === "REQUIRED" || upper === "CHANGEME" || upper === "<REQUIRED>") req.push(key);
  else if (upper === "OPTIONAL" || v.length > 0) opt.push(key);
}

req.sort();
opt.sort();

const outDir = path.join(root, "artifacts", "deploy");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "env_required.txt"), req.join("\n") + (req.length ? "\n" : ""), "utf8");
fs.writeFileSync(path.join(outDir, "env_optional.txt"), opt.join("\n") + (opt.length ? "\n" : ""), "utf8");

const payload = { ok: true, required: req, optional: opt, ts: Date.now() };
fs.writeFileSync(path.join(outDir, "env_contract.json"), JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(`env_contract_ok required=${req.length} optional=${opt.length}`);
