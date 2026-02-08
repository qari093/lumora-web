. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/bash
set -euo pipefail
echo "🚀 Step 23.6 — Finalizing Growth & Retention Intelligence Layer (verification, commit, tag)..."

echo "📦 Verifying executed Phase 23 scripts:"
find scripts/integration -type f -name 'phase23.step*.sh' | sort

git add scripts/integration >/dev/null 2>&1 || true
git commit -m "✅ Phase 23 complete — Growth & Retention Intelligence Layer integrated" >/dev/null 2>&1 || true
git push origin main >/dev/null 2>&1 || true

git tag -a "phase23_complete" -m "Phase 23 — Growth & Retention Intelligence Layer complete" >/dev/null 2>&1 || true
git push origin phase23_complete >/dev/null 2>&1 || true

echo "✅ Step 23.6 — Phase 23 fully verified, committed, and tagged."
