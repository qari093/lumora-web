#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
BASE="${LIVE_BASE_URL:-http://127.0.0.1:${PORT}}"

echo "Live Contract Suite — START
BASE=http://127.0.0.1:${PORT:-3000}"
echo "BASE=$BASE"
echo

echo "• Guard: no heredoc artifacts"
sh scripts/live/no_heredoc_guard.sh
echo "✓ guard ok"
echo

echo "• Typecheck"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx --yes tsc --noEmit
fi
echo "✓ tsc"
echo

echo "• WARMUP: live healthz + deprecated aliases (compile-safe)"
# First hit may compile in Next dev; allow longer.
curl -sS --max-time 20 "$BASE/live/healthz" >/dev/null || true
curl -sS --max-time 20 "$BASE/api/live/rooms/list" >/dev/null || true
curl -sS --max-time 20 "$BASE/api/live/rooms/public" >/dev/null || true
# Fast follow-up (2s) ensures warmed
curl -sS --max-time 2 "$BASE/live/healthz" >/dev/null || true
curl -sS --max-time 2 "$BASE/api/live/rooms/list" >/dev/null || true
curl -sS --max-time 2 "$BASE/api/live/rooms/public" >/dev/null || true
echo "✓ warmup"
echo


# STRONG_WARMUP_STEP71
echo "• STRONG WARMUP: compile + stabilize live routes (retries, longer timeouts) [step71]"
warm_try() {
  url="$1"; expect="$2";
  i=1;
  while [ "$i" -le 10 ]; do
    tr -d '\r' </dev/null >/dev/null 2>&1 || true
    curl -sS -m 20 -D /tmp/lumora_warm_h.txt "$url" -o /tmp/lumora_warm_b.txt >/dev/null 2>&1 || true
    status="$(tr -d '\r' </tmp/lumora_warm_h.txt 2>/dev/null | head -n1 | awk '{print $2}' || true)"
    body_head="$(head -c 240 /tmp/lumora_warm_b.txt 2>/dev/null || true)"
    if [ -n "$expect" ]; then
      if echo "$body_head" | grep -q "$expect"; then
        echo "  ✓ warm ok: $url (try $i)"
        return 0
      fi
    else
      if [ "$status" = "200" ] || [ "$status" = "410" ]; then
        echo "  ✓ warm ok: $url (try $i, status $status)"
        return 0
      fi
    fi
    i=$((i+1))
    sleep 0.45
  done
  echo "  ❌ warm failed: $url" >&2
  echo "    status=$status" >&2
  echo "    head=$(printf '%s' "$body_head" | tr '\n' ' ' | head -c 180)" >&2
  return 1
}

# Warm core JSON routes
warm_try "$BASE/api/live/healthz" "" || true
warm_try "$BASE/api/live/rooms" '"ok":' || true
warm_try "$BASE/api/live/portal-hubs" '"hubs":' || true
warm_try "$BASE/api/live/health-badge" '"status":' || true
warm_try "$BASE/api/live/room-state" '"roomId":' || true

# Warm deprecated aliases (must be quick 410)
warm_try "$BASE/api/live/room-list" '"ROUTE_DEPRECATED"' || true
warm_try "$BASE/api/live/rooms/list" '"ROUTE_DEPRECATED"' || true
warm_try "$BASE/api/live/rooms/public" '"ROUTE_DEPRECATED"' || true

# Warm SSE: must emit connected quickly
i=1
while [ "$i" -le 10 ]; do
  head4="$(curl -sS -m 12 "$BASE/api/live/events" | head -n 4 || true)"
  if printf "%s" "$head4" | grep -qi "event: connected"; then
    echo "  ✓ warm ok: /api/live/events (try $i)"
    break
  fi
  i=$((i+1))
  sleep 0.45
done
echo "✓ strong warmup (step71)"
echo "• Contracts: vitest run tests/live"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run tests/live
else
  npx --yes vitest run tests/live
fi
echo "✓ contracts"
echo

echo "• Smoke: portal-hubs (2s)"
code_hubs="$(curl -sS --max-time 2 -o /dev/null -w "%{http_code}" "$BASE/api/live/portal-hubs" || true)"
echo "  portal-hubs HTTP $code_hubs"
[ "$code_hubs" = "200" ] || { echo "❌ portal-hubs not 200"; exit 3; }

echo "• Smoke: rooms (2s)"
code_rooms="$(curl -sS --max-time 2 -o /dev/null -w "%{http_code}" "$BASE/api/live/rooms" || true)"
echo "  rooms HTTP $code_rooms"
[ "$code_rooms" = "200" ] || { echo "❌ rooms not 200"; exit 4; }

echo "• Smoke: health-badge (2s)"
code_badge="$(curl -sS --max-time 2 -o /dev/null -w "%{http_code}" "$BASE/api/live/health-badge" || true)"
echo "  health-badge HTTP $code_badge"
[ "$code_badge" = "200" ] || { echo "❌ health-badge not 200"; exit 5; }

echo
echo "Live Contract Suite — OK"
