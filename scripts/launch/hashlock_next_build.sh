#!/bin/sh
set -euo pipefail

# Usage:
#   sh scripts/launch/hashlock_next_build.sh <NEXT_DIR> <OUT_HASH_FILE>
# NEXT_DIR should be a directory that contains ".next" (repo root) OR an actual ".next" dir.
NEXT_DIR="${1:-}"
OUT_FILE="${2:-}"
if [ -z "${NEXT_DIR:-}" ] || [ -z "${OUT_FILE:-}" ]; then
  echo "usage: hashlock_next_build.sh <NEXT_DIR> <OUT_HASH_FILE>" >&2
  exit 2
fi

# Resolve .next root
if [ -d "$NEXT_DIR/.next" ]; then
  ROOT="$NEXT_DIR/.next"
elif [ -d "$NEXT_DIR" ] && [ "$(basename "$NEXT_DIR")" = ".next" ]; then
  ROOT="$NEXT_DIR"
else
  echo "❌ Could not locate .next under: $NEXT_DIR" >&2
  exit 2
fi

# Deterministic: write "sha256  <relpath>" (relpath relative to .next)
node - "$ROOT" "$OUT_FILE" <<'NODE'
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.argv[2];
const outFile = process.argv[3];

const excludeDirRe = /(^|\/)(cache|trace|traces|telemetry|profiling|pack|webpack|turbopack|logs)(\/|$)/;

const volatileExact = new Set([
  "BUILD_ID",
  "build-manifest.json",
  "app-build-manifest.json",
  "app-path-routes-manifest.json",
  "routes-manifest.json",
  "prerender-manifest.json",
  "react-loadable-manifest.json",
  "required-server-files.json",
  "images-manifest.json",
  "dynamic-css-manifest.json",
  "export-marker.json",
  "middleware-manifest.json",
  "middleware-react-loadable-manifest.json",
  "server/middleware-manifest.json",
  "server/app-paths-manifest.json",
]);

function isExcluded(relPosix) {
  const rel = relPosix.replace(/\\/g, "/").replace(/^\/+/, "");
  if (excludeDirRe.test("/" + rel)) return true;

  const base = path.posix.basename(rel);
  if (volatileExact.has(base) || volatileExact.has(rel)) return true;

  // common Next volatile classes
  if (rel.endsWith(".nft.json")) return true;
  if (base === "page_client-reference-manifest.js") return true;
  if (rel.endsWith(".js.map") || rel.endsWith(".css.map")) return true;

  // server-render artifacts often embed build ids/paths
  if (rel.endsWith(".rsc") || rel.endsWith(".meta") || rel.endsWith(".html")) return true;

  return false;
}

const files = [];
function walk(dir, relBase = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = relBase ? `${relBase}/${e.name}` : e.name;
    const relPosix = rel.replace(/\\/g, "/");
    if (isExcluded(relPosix)) continue;
    if (e.isDirectory()) walk(full, rel);
    else if (e.isFile()) files.push({ full, rel: relPosix });
  }
}
walk(root);
files.sort((a,b)=>a.rel.localeCompare(b.rel));

let out = "";
for (const f of files) {
  const h = crypto.createHash("sha256").update(fs.readFileSync(f.full)).digest("hex");
  out += `${h}  ${f.rel}\n`;
}

fs.writeFileSync(outFile, out, "utf8");
console.log(`✓ hashlock wrote ${files.length} entries -> ${outFile}`);
NODE
