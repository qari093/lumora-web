import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const personaDir = path.join(ROOT, "public", "persona");
const outFile = path.join(personaDir, "manifest.json");

function walk(dir) {
  const out = [];
  const items = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

if (!fs.existsSync(personaDir)) {
  console.error("❌ Missing public/persona directory");
  process.exit(2);
}

const files = walk(personaDir)
  .filter((p) => !p.endsWith("manifest.json"))
  .filter((p) => !p.endsWith(".DS_Store"));

const entries = [];
for (const abs of files) {
  const rel = "/" + path.relative(path.join(ROOT, "public"), abs).replaceAll(path.sep, "/");
  const buf = fs.readFileSync(abs);
  const st = fs.statSync(abs);
  entries.push({
    path: rel,
    bytes: st.size,
    sha256: sha256(buf),
    mtimeMs: st.mtimeMs,
  });
}

entries.sort((a, b) => a.path.localeCompare(b.path));

const summary = {
  ok: true,
  generatedAt: new Date().toISOString(),
  counts: {
    total: entries.length,
    avatarsNeutral: entries.filter((e) => e.path.includes("/persona/avatars/neutral/")).length,
    avatarsVariants: entries.filter((e) => e.path.includes("/persona/avatars/") && !e.path.includes("/neutral/")).length,
    emojis: entries.filter((e) => e.path.includes("/persona/emojis/")).length,
  },
  entries,
};

fs.writeFileSync(outFile, JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log("✓ Wrote:", path.relative(ROOT, outFile));
console.log("✓ Entries:", entries.length);
