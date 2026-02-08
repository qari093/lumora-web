. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu
PORT="${PORT:-3040}"
HOST="http://127.0.0.1:${PORT}"

ROUTES="
/
 /wallet
 /private-access
"

REQ_HEADERS="
content-security-policy
x-content-type-options
x-frame-options
referrer-policy
permissions-policy
"

OUT="/tmp/step53_security_headers_core_routes.txt"
: > "$OUT"

echo "▶️ Step 53/91 — Verify security headers on core routes (prod)"
echo "──────────────────────────────────────────────────────────────"
echo "• host: ${HOST}"
echo

fail=0
for r in $ROUTES; do
  rr="$(echo "$r" | tr -d ' ')"
  [ -n "$rr" ] || continue
  url="${HOST}${rr}"

  echo "• HEAD ${rr} (follow redirects)"
  hdrs="$(curl -sS -L -I "$url" 2>/dev/null || true)"
  hdrs="$(printf "%s\n" "$hdrs" | tr -d '\r')"

  {
    echo "==== ${rr} ===="
    echo "$hdrs"
    echo
  } >> "$OUT"

  for h in $REQ_HEADERS; do
    if printf "%s\n" "$hdrs" | grep -qi "^${h}:"; then :; else
      echo "❌ missing header: ${h} on ${rr}"
      fail=1
    fi
  done

  echo "✓ checked"
  echo
done

echo "• artifact: ${OUT}"

if [ "$fail" -ne 0 ]; then
  exit 2
fi

echo "✅ Step 53/91 — verifier passed"
