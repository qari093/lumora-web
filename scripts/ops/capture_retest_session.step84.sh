#!/bin/sh
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
cd "$PROJECT_ROOT" || { echo "❌ project not found"; exit 1; }

mkdir -p ops/_retests

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
F="ops/_retests/retest_session_${TS//[:]/}.md"

cat >"$F" <<EOF
# Retest Session — $TS

## Tester
- Name/ID:
- Device:
- OS:
- Browser:
- Network:

## Build / Flags
- Private access: enabled
- Notes:

## Tasks executed
1)
2)
3)

## Findings
- What improved:
- What got worse:
- New blockers:

## Decision
- Pass / Needs fixes
- Next action:
EOF

chmod 444 "$F" 2>/dev/null || true
echo "✓ Created: $F"
