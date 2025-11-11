#!/usr/bin/env bash
# Step 25.10 — Inject LumaSpaceStateBanner into LumaSpace pages (fixed variant)
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "Project not found at $ROOT"; exit 1; }

LOG_FILE="logs/phase25.step10.lumaspace-banner-wire.log"
mkdir -p logs
echo "Step 25.10 — wiring LumaSpaceStateBanner into pages (fixed)" | tee "$LOG_FILE"

inject_banner () {
  local file="$1"
  local variant="$2" # "compact" or "full"

  if [ ! -f "$file" ]; then
    echo "skip: $file not found" | tee -a "$LOG_FILE"
    return
  fi

  node - <<JS
const fs = require("fs");
const path = "$file";
const variant = "$variant";

let src = fs.readFileSync(path, "utf8");
let original = src;
let changed = false;

const importLine = 'import { LumaSpaceStateBanner } from "@/app/_components/lumaspace/state-banner";';

if (!src.includes("LumaSpaceStateBanner")) {
  const importRegex = /(import[^;]+from\\s+["'][^"']+["'];?\\s*)+/;
  if (importRegex.test(src)) {
    src = src.replace(importRegex, (block) => block + "\\n" + importLine + "\\n");
  } else {
    src = importLine + "\\n\\n" + src;
  }
  changed = true;
}

if (!src.includes("<LumaSpaceStateBanner")) {
  const mainRegex = /<main[^>]*>/;
  const mount =
    variant === "compact"
      ? "<LumaSpaceStateBanner compact />"
      : "<LumaSpaceStateBanner />";

  if (mainRegex.test(src)) {
    src = src.replace(mainRegex, (m) => m + "\\n      " + mount);
    changed = true;
  } else {
    const returnRegex = /return\\s*\\(\\s*<[^>]+>/;
    if (returnRegex.test(src)) {
      src = src.replace(returnRegex, (m) => m + "\\n      " + mount);
      changed = true;
    }
  }
}

if (changed && src !== original) {
  fs.writeFileSync(path, src, "utf8");
  console.log("patched", path);
} else {
  console.log("no-change", path);
}
JS
}

inject_banner "app/lumaspace/page.tsx" "compact"
inject_banner "app/me/space/page.tsx" "full"

PORT="${PORT:-3000}"
echo "Smoke check — /lumaspace and /me/space (PORT=$PORT)" | tee -a "$LOG_FILE"

check_route () {
  local path="$1"
  local label="$2"
  local url="http://127.0.0.1:${PORT}${path}"
  echo "$label  ($url)" | tee -a "$LOG_FILE"
  if curl -fsS -D /tmp/phase25.step10.hdr.$$ -o /tmp/phase25.step10.body.$$ "$url" 2>>"$LOG_FILE"; then
    head -n 6 /tmp/phase25.step10.hdr.$$ | tee -a "$LOG_FILE"
    echo "--- body preview ---" | tee -a "$LOG_FILE"
    head -c 220 /tmp/phase25.step10.body.$$ 2>/dev/null | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
  else
    echo "request failed for $url (see log)" | tee -a "$LOG_FILE"
  fi
  rm -f /tmp/phase25.step10.hdr.$$ /tmp/phase25.step10.body.$$ 2>/dev/null || true
}

check_route "/lumaspace" "LumaSpace index"
check_route "/me/space"  "My Space page"

echo "Step 25.10 — done" | tee -a "$LOG_FILE"
