#!/bin/sh
set -euo pipefail
cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

ENV_FILE=".env.production.local"

port_is_busy(){ lsof -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
probe_health() {
  p="$1"
  curl -fsS "http://127.0.0.1:${p}/api/healthz" >/dev/null 2>&1 && { echo "/api/healthz"; return 0; }
  curl -fsS "http://127.0.0.1:${p}/api/health"  >/dev/null 2>&1 && { echo "/api/health";  return 0; }
  return 1
}

# Auto-detect port if not provided
PORT="${1:-}"
EP=""
if [ -z "${PORT:-}" ]; then
  for p in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010; do
    ep="$(probe_health "$p" || true)"
    if [ -n "${ep:-}" ]; then PORT="$p"; EP="$ep"; break; fi
  done
else
  EP="$(probe_health "$PORT" || true)"
fi

[ -n "${PORT:-}" ] || { echo "❌ no responding prod server found on ports 3000-3010"; exit 2; }
[ -n "${EP:-}" ] || { echo "❌ server found on port=$PORT but no health endpoint responded"; exit 2; }

read_env_key_raw() {
  key="$1"; file="$2"
  [ -f "$file" ] || return 1
  raw="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}[[:space:]]*=" "$file" | tail -n1 || true)"
  [ -n "${raw:-}" ] || return 1
  v="$(printf "%s" "$raw" | sed -E "s/^[[:space:]]*(export[[:space:]]+)?${key}[[:space:]]*=[[:space:]]*//" | tr -d '\r')"
  printf "%s" "$v"
  return 0
}
clean_val(){ printf "%s" "${1:-}" | sed -E "s/^[\"']//; s/[\"']$//" | tr -d '[:space:]'; }

ALLOW_RAW="$(read_env_key_raw LUMORA_PRIVATE_ALLOWLIST "$ENV_FILE" || true)"
[ -n "${ALLOW_RAW:-}" ] || ALLOW_RAW="$(read_env_key_raw LUMORA_ALLOWLIST "$ENV_FILE" || true)"
ALLOW="$(clean_val "$ALLOW_RAW")"

TOK_RAW="$(read_env_key_raw LUMORA_PRIVATE_TOKEN "$ENV_FILE" || true)"
[ -n "${TOK_RAW:-}" ] || TOK_RAW="$(read_env_key_raw LUMORA_PRIVATE_ACCESS_TOKEN "$ENV_FILE" || true)"
[ -n "${TOK_RAW:-}" ] || TOK_RAW="$(read_env_key_raw LUMORA_TOKEN "$ENV_FILE" || true)"
TOK="$(clean_val "$TOK_RAW")"

EMAIL="$(printf "%s" "$ALLOW" | tr ',; ' '\n\n\n' | grep -E -i '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' | head -n1 | tr '[:upper:]' '[:lower:]' || true)"
[ -n "${EMAIL:-}" ] || { echo "❌ allowlist email not found in $ENV_FILE"; exit 2; }
[ -n "${TOK:-}" ] || { echo "❌ token not found in $ENV_FILE"; exit 2; }

curl -fsS "http://127.0.0.1:${PORT}/robots.txt" | grep -qi "Disallow: /" || { echo "❌ robots not locked"; exit 2; }
echo "✓ robots locked (port=$PORT)"

HDR="/tmp/lumora_private_headers.smoke.txt"
BODY="/tmp/lumora_private_body.smoke.txt"
PAYLOAD="$(EMAIL="$EMAIL" TOK="$TOK" node -e 'process.stdout.write(JSON.stringify({email:process.env.EMAIL, token:process.env.TOK}))')"

HTTP="$(curl -sS -D "$HDR" -o "$BODY" -w "%{http_code}" -H "content-type: application/json" -X POST "http://127.0.0.1:${PORT}/api/private-access" --data "$PAYLOAD" || true)"
[ "$HTTP" -ge 200 ] && [ "$HTTP" -lt 400 ] || { echo "❌ private-access failed http=$HTTP"; sed -n '1,240p' "$BODY" || true; exit 2; }

COOKIE_LINE="$(grep -i '^set-cookie:' "$HDR" | grep -i 'lumora_email=' | head -n1 || true)"
[ -n "${COOKIE_LINE:-}" ] || { echo "❌ missing Set-Cookie lumora_email"; exit 2; }
COOKIE_PAIR="$(printf "%s" "$COOKIE_LINE" | sed -E 's/^[Ss]et-[Cc]ookie:[[:space:]]*//; s/;.*$//')"

ROOT_CODE="$(curl -sS -o /dev/null -w "%{http_code}" -H "cookie: ${COOKIE_PAIR}" "http://127.0.0.1:${PORT}/" || true)"
[ "$ROOT_CODE" = "200" ] || { echo "❌ / not 200 with cookie (http=$ROOT_CODE)"; exit 2; }

NO_COOKIE_CODE="$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/" || true)"
[ "$NO_COOKIE_CODE" = "200" ] && { echo "❌ gate not enforced (/ returned 200 without cookie)"; exit 2; }

echo "✓ private gate OK (cookie grants access; no-cookie blocked)"
