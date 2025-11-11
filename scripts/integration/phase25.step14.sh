#!/usr/bin/env bash
# Step 25.14 — LumaSpace CI wiring (npm script + GitHub Actions workflow)
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

LOG_FILE="logs/phase25.step14.lumaspace-ci.log"
mkdir -p logs

echo "Step 25.14 — wiring LumaSpace checks into npm scripts + CI" | tee "$LOG_FILE"

# ─────────────────────────────────────────
# 1) Ensure npm script: test:lumaspace
# ─────────────────────────────────────────
if [ ! -f package.json ]; then
  echo "❌ package.json not found — cannot add npm script" | tee -a "$LOG_FILE"
else
  node - <<'JS'
const fs = require("fs");
const path = "package.json";

const raw = fs.readFileSync(path, "utf8");
const pkg = JSON.parse(raw);

if (!pkg.scripts) pkg.scripts = {};

if (!pkg.scripts["test:lumaspace"]) {
  pkg.scripts["test:lumaspace"] = "bash scripts/integration/phase25.step13.sh";
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("added script: test:lumaspace");
} else {
  console.log("script already present: test:lumaspace");
}
JS
fi

# ─────────────────────────────────────────
# 2) CI workflow for LumaSpace checks
# ─────────────────────────────────────────
WF=".github/workflows/lumaspace-ci.yml"

cat >"$WF" <<'YAML'
name: LumaSpace State & Tests

on:
  push:
    paths:
      - "app/api/lumaspace/**"
      - "app/lumaspace/**"
      - "app/me/space/**"
      - "app/_components/lumaspace/**"
      - "tests/**"
      - "scripts/integration/phase25.step11.sh"
      - "scripts/integration/phase25.step13.sh"
      - ".github/workflows/lumaspace-ci.yml"
  pull_request:
    paths:
      - "app/api/lumaspace/**"
      - "app/lumaspace/**"
      - "app/me/space/**"
      - "app/_components/lumaspace/**"
      - "tests/**"
      - "scripts/integration/phase25.step11.sh"
      - "scripts/integration/phase25.step13.sh"
      - ".github/workflows/lumaspace-ci.yml"

jobs:
  lumaspace-checks:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Start dev server (background)
        env:
          PORT: 3000
        run: |
          pkill -f "next dev" || true
          PORT=$PORT npx next dev >/tmp/next-dev.out 2>&1 &
          sleep 15
          echo "--- next-dev.out (tail) ---"
          tail -n 40 /tmp/next-dev.out || true

      - name: LumaSpace state contract (HTTP)
        env:
          PORT: 3000
        run: |
          bash scripts/integration/phase25.step11.sh

      - name: LumaSpace tests (unit + utils)
        run: |
          npm run test:lumaspace
YAML

echo "CI workflow written to $WF" | tee -a "$LOG_FILE"

echo "Step 25.14 — done" | tee -a "$LOG_FILE"
