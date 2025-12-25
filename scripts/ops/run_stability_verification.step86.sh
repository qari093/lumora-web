#!/bin/sh
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
cd "$PROJECT_ROOT" || { echo "❌ project not found"; exit 1; }

ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
out="ops/_analysis/stability_verification_report.step86.json"
mkdir -p ops/_analysis

run() {
  name="$1"; shift
  if "$@" >/tmp/step86_cmd.out 2>&1; then
    echo "✓ $name"
    printf '{"name":"%s","ok":true}\n' "$name"
  else
    echo "❌ $name"
    tail -n 40 /tmp/step86_cmd.out || true
    printf '{"name":"%s","ok":false,"tail":"%s"}\n' "$name" "$(tail -n 12 /tmp/step86_cmd.out | sed 's/"/\\"/g')"
  fi
}

# Determine runner (pnpm vs npm)
if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then
  R="pnpm"
else
  R="npm"
fi

# Lint may not exist; treat missing as skipped
LINT_OK=true
if node -e 'const p=require("./package.json"); process.exit(p.scripts&&p.scripts.lint?0:1)' >/dev/null 2>&1; then
  if "$R" -s run lint >/tmp/step86_cmd.out 2>&1; then
    echo "✓ lint"
  else
    echo "❌ lint"
    tail -n 40 /tmp/step86_cmd.out || true
    LINT_OK=false
  fi
else
  echo "ℹ lint not configured (skipped)"
fi

TYPE_OK=true
if node -e 'const p=require("./package.json"); process.exit(p.scripts&&p.scripts.typecheck?0:1)' >/dev/null 2>&1; then
  if "$R" -s run typecheck >/tmp/step86_cmd.out 2>&1; then
    echo "✓ typecheck"
  else
    echo "❌ typecheck"
    tail -n 40 /tmp/step86_cmd.out || true
    TYPE_OK=false
  fi
else
  if command -v npx >/dev/null 2>&1; then
    if npx -s tsc --noEmit >/tmp/step86_cmd.out 2>&1; then
      echo "✓ tsc --noEmit"
    else
      echo "❌ tsc --noEmit"
      tail -n 40 /tmp/step86_cmd.out || true
      TYPE_OK=false
    fi
  else
    TYPE_OK=false
  fi
fi

BUILD_OK=true
if node -e 'const p=require("./package.json"); process.exit(p.scripts&&p.scripts.build?0:1)' >/dev/null 2>&1; then
  if "$R" -s run build >/tmp/step86_cmd.out 2>&1; then
    echo "✓ build"
  else
    echo "❌ build"
    tail -n 40 /tmp/step86_cmd.out || true
    BUILD_OK=false
  fi
else
  BUILD_OK=false
fi

# Health endpoint (best-effort; server may not be running)
HEALTH_OK="unknown"
if command -v curl >/dev/null 2>&1; then
  if curl -fsS "http://127.0.0.1:3000/api/health" >/tmp/step86_cmd.out 2>&1; then
    HEALTH_OK="true"
    echo "✓ health (localhost:3000)"
  else
    HEALTH_OK="false"
    echo "⚠ health check failed (is dev server running?)"
  fi
fi

cat >"$out" <<EOF
{
  "step": 86,
  "kind": "stability_verification_report",
  "createdAt": "$ts",
  "runner": "$R",
  "results": {
    "lintOk": $LINT_OK,
    "typecheckOk": $TYPE_OK,
    "buildOk": $BUILD_OK,
    "healthOk": $HEALTH_OK
  },
  "gate": {
    "expandPrivateCohortAllowed": $( [ "$TYPE_OK" = true ] && [ "$BUILD_OK" = true ] && echo true || echo false )
  }
}
EOF

chmod 444 "$out" 2>/dev/null || true
echo "✓ Wrote: $out"
