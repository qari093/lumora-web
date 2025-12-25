#!/bin/sh
set -euo pipefail

cd "$(dirname "$0")/../.." || exit 1

# Auto-detect active prod port by probing common health endpoints on a small port set.
detect_port() {
  # prefer hint file if present
  if [ -f "ops/_runbooks/ACTIVE_PROD_PORT.txt" ]; then
    p="$(tr -dc '0-9' < ops/_runbooks/ACTIVE_PROD_PORT.txt | head -c 5 || true)"
    if [ -n "${p:-}" ] && curl -fsS "http://127.0.0.1:${p}/api/healthz" >/dev/null 2>&1; then
      echo "$p"
      return 0
    fi
  fi

  for p in 3000 3001 3002 3003 3004 3005; do
    if curl -fsS "http://127.0.0.1:${p}/api/healthz" >/dev/null 2>&1; then
      echo "$p"
      return 0
    fi
    if curl -fsS "http://127.0.0.1:${p}/api/health" >/dev/null 2>&1; then
      echo "$p"
      return 0
    fi
  done
  return 1
}

detect_health_ep() {
  p="$1"
  if curl -fsS "http://127.0.0.1:${p}/api/healthz" >/dev/null 2>&1; then echo "/api/healthz"; return 0; fi
  if curl -fsS "http://127.0.0.1:${p}/api/health" >/dev/null 2>&1; then echo "/api/health"; return 0; fi
  return 1
}

# Robustly read a key from env files (supports quotes/spaces; takes first match).
read_env() {
  key="$1"
  for f in ".env.production.local" ".env.local" ".env"; do
    [ -f "$f" ] || continue
    v="$(
      awk -F= -v WANT="$key" '
        function strip(s){ gsub(/^[ \t\r\n"'\''`]+|[ \t\r\n"'\''`]+$/, "", s); return s }
        /^[ \t]*#/ { next }
        /^[ \t]*$/ { next }
        {
          k=$1; v=$0; sub(/^[^=]*=/,"",v)
          k=strip(k); v=strip(v)
          if (k==WANT && v!="") { print v; exit }
        }
      ' "$f"
    )"
    if [ -n "${v:-}" ]; then
      printf "%s" "$v"
      return 0
    fi
  done
  return 1
}

first_email_from_allowlist() {
  raw="$1"
  # split on common separators and pick first valid email
  printf "%s" "$raw" | tr ',; ' '\n' | awk 'tolower($0) ~ /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/ { print tolower($0); exit }'
}

PORT="$(detect_port)" || { echo "❌ Could not detect active prod port"; exit 2; }
EP="$(detect_health_ep "$PORT")" || { echo "❌ Could not detect health endpoint"; exit 2; }

mkdir -p ops/_runbooks ops/_analysis

echo "$PORT" > ops/_runbooks/ACTIVE_PROD_PORT.txt

# Validate robots
robots="$(curl -fsS "http://127.0.0.1:${PORT}/robots.txt" | tr -d '\r' || true)"
printf "%s\n" "$robots" | grep -q "Disallow: /" || { echo "❌ robots not locked"; printf "%s\n" "$robots"; exit 2; }
echo "✓ robots locked (port=$PORT)"

# Env discovery
AL_RAW="$(
  read_env "LUMORA_PRIVATE_ALLOWLIST" 2>/dev/null || true
)"
[ -n "${AL_RAW:-}" ] || AL_RAW="$(
  read_env "LUMORA_ALLOWLIST" 2>/dev/null || true
)"
[ -n "${AL_RAW:-}" ] || AL_RAW="$(
  read_env "LUMORA_PRIVATE_ACCESS_ALLOWLIST" 2>/dev/null || true
)"

TOK="$(
  read_env "LUMORA_PRIVATE_TOKEN" 2>/dev/null || true
)"
[ -n "${TOK:-}" ] || TOK="$(
  read_env "LUMORA_PRIVATE_ACCESS_TOKEN" 2>/dev/null || true
)"
[ -n "${TOK:-}" ] || TOK="$(
  read_env "LUMORA_TOKEN" 2>/dev/null || true
)"

EMAIL="$(first_email_from_allowlist "${AL_RAW:-}")"

[ -n "${EMAIL:-}" ] || { echo "❌ Could not discover allowlist email"; echo "• raw allowlist: ${AL_RAW:-<empty>}"; exit 2; }
[ -n "${TOK:-}" ] || { echo "❌ Could not discover private token"; exit 2; }

# Mint cookie
CJ="$(mktemp)"
trap 'rm -f "$CJ"' EXIT

code="$(curl -sS -o /tmp/private_mode_smoke_body.json -w "%{http_code}" \
  -c "$CJ" \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:${PORT}/api/private-access" \
  --data "{\"email\":\"$EMAIL\",\"token\":\"$TOK\"}")"

[ "$code" = "200" ] || {
  echo "❌ private-access mint failed (http=$code)"
  echo "• body:"
  cat /tmp/private_mode_smoke_body.json 2>/dev/null || true
  exit 2
}

grep -q "lumora_email" "$CJ" || { echo "❌ cookie not set"; cat "$CJ"; exit 2; }
echo "✓ Cookie minted: lumora_email=***"

# Root gating check
noc="$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/")"
[ "$noc" = "307" ] || { echo "❌ expected redirect without cookie; got $noc"; exit 2; }
yesc="$(curl -sS -o /dev/null -w "%{http_code}" -b "$CJ" "http://127.0.0.1:${PORT}/")"
[ "$yesc" = "200" ] || { echo "❌ expected 200 with cookie; got $yesc"; exit 2; }

echo "✓ private gate OK (cookie grants access; no-cookie blocked)"
echo "✓ smoke OK"
