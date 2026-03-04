import fs from "node:fs";

const file = "scripts/guard/ci_preflight.sh";
let s = fs.readFileSync(file, "utf8");

const start = "### LUMORA_PREFLIGHT_ROOT (autofix) ###";
const end = "### /LUMORA_PREFLIGHT_ROOT (autofix) ###";

if (!s.includes(start) || !s.includes(end)) {
  throw new Error("ci_preflight root block markers not found; expected prior steps to have inserted them.");
}

const blockRe = new RegExp(
  String.raw`${start}[\s\S]*?${end}`,
  "m"
);

const newBlock = [
  start,
  'PREFLIGHT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
  'LUMORA_PREFLIGHT_ROOT="$(cd "${PREFLIGHT_DIR}/../.." && pwd)"',
  '',
  '# If the computed root is a home-level git repo and the actual project is nested',
  '# at ${root}/lumora-web, switch to that automatically.',
  'if [ ! -d "${LUMORA_PREFLIGHT_ROOT}/prisma" ] && [ -d "${LUMORA_PREFLIGHT_ROOT}/lumora-web/prisma" ] && [ -f "${LUMORA_PREFLIGHT_ROOT}/lumora-web/package.json" ]; then',
  '  LUMORA_PREFLIGHT_ROOT="${LUMORA_PREFLIGHT_ROOT}/lumora-web"',
  'fi',
  '',
  'cd "${LUMORA_PREFLIGHT_ROOT}"',
  'export PRISMA_SCHEMA="${LUMORA_PREFLIGHT_ROOT}/prisma/schema.prisma"',
  'if [ ! -f "${PRISMA_SCHEMA}" ]; then',
  '  echo "❌ prisma schema not found at ${PRISMA_SCHEMA}"',
  '  echo "Current tree:"',
  '  (ls -la "${LUMORA_PREFLIGHT_ROOT}" || true)',
  '  (ls -la "${LUMORA_PREFLIGHT_ROOT}/prisma" || true)',
  '  exit 1',
  'fi',
  end,
].join("\n");

s = s.replace(blockRe, newBlock);
fs.writeFileSync(file, s);
process.stdout.write("✓ patched ci_preflight: nested-root fallback (root/lumora-web)\n");
