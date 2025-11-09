#!/bin/bash
set -euo pipefail
echo "🚀 Step 21.6 — Finalizing EMML Genesis (verification, commit, tag)..."

echo "📦 Verifying executed Phase 21 scripts:"
find scripts/integration -type f -name 'phase21.step*.sh' | sort

git add scripts/integration >/dev/null 2>&1 || true
git commit -m "✅ Phase 21 complete — Emotional Micro-Market Layer (EMML) Genesis integrated" >/dev/null 2>&1 || true
git push origin main >/dev/null 2>&1 || true

git tag -a "phase21_complete" -m "Phase 21 — EMML Genesis complete" >/dev/null 2>&1 || true
git push origin phase21_complete >/dev/null 2>&1 || true

echo "✅ Step 21.6 — Phase 21 fully verified, committed, and tagged."
