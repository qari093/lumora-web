#!/bin/sh
set -euo pipefail

BASE="$(sh scripts/dev/detect_base.sh 2>/dev/null || true)"
OUT="/tmp/lumora_live_quickcheck_e2e.$(date +%s).log"

{
  echo "BASE=${BASE:-<empty>}"
  echo "ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo

  if [ -z "${BASE:-}" ]; then
    echo "❌ detect_base empty. Start dev: pnpm dev"
    exit 0
  fi

  echo "→ Publish event"
  curl -sS -m 6 -H 'content-type: application/json' \
    -d '{"roomId":"demo-room","kind":"event","payload":{"from":"quickcheck"}}' \
    "${BASE}/api/live/publish" | head -c 260 || true
  echo

  echo "→ Room-state"
  curl -sS -m 6 "${BASE}/api/live/room-state?roomId=demo-room" | head -c 260 || true
  echo

  echo "→ SSE head"
  curl -i -N -m 6 "${BASE}/api/live/events?roomId=demo-room" | head -n 30 || true
  echo

  echo "→ Vitest: publish + SSE contracts + E2E"
  BASE="${BASE}" pnpm -s vitest run \
    tests/live/room_state.publish.contract.test.ts \
    tests/live/events.sse.contract.test.ts \
    tests/live/sse.publish.e2e.test.ts || true
  echo "✓ vitest (non-fatal)"
  echo
  echo "OK"
} 2>&1 | tee "$OUT" >/dev/null

echo "✓ Transcript: $OUT"
exit 0
