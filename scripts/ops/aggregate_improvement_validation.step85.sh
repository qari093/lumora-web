#!/bin/sh
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
cd "$PROJECT_ROOT" || { echo "❌ project not found"; exit 1; }

out="ops/_analysis/improvement_validation_summary.step85.json"
ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

count_md() {
  d="$1"
  [ -d "$d" ] || { echo 0; return; }
  find "$d" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' '
}

fr="$(count_md ops/_friction)"
fb="$(count_md ops/_feedback)"
ob="$(count_md ops/_observations)"
rt="$(count_md ops/_retests)"

cat >"$out" <<EOF
{
  "step": 85,
  "kind": "validate_improvements_summary",
  "createdAt": "$ts",
  "counts": {
    "frictionFiles": $fr,
    "feedbackFiles": $fb,
    "observationFiles": $ob,
    "retestFiles": $rt
  },
  "artifacts": {
    "validationDoc": "ops/private_testers/improvement_validation.step85.md",
    "blockersTracker": "ops/private_testers/critical_ux_blockers.step82.md",
    "valueAssessment": "ops/private_testers/portal_value_assessment_form.step80.md"
  },
  "notes": [
    "This is a lightweight summary; real validation requires filling the Step 85 doc with before/after findings.",
    "If retestFiles is 0, run Step 84 capture during a session."
  ]
}
EOF

chmod 444 "$out" 2>/dev/null || true
echo "✓ Wrote: $out"
