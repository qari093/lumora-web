#!/bin/sh
set +e

BASE="$(sh scripts/dev/detect_base.sh 2>/dev/null || true)"
echo "✓ BASE=${BASE:-<empty>}"

echo
echo "→ Typecheck"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npm run -s tsc -- --noEmit
fi
echo "  ↳ rc=$?"

if [ -z "${BASE:-}" ]; then
  echo
  echo "ℹ Dev not detected (no /live/healthz on 3000–3010). Start dev:"
  echo "   pnpm dev"
  exit 0
fi

echo
echo "→ Warm healthz"
curl -sS -m 6 -o /dev/null -w "HTTP %{http_code}\n" "${BASE}/live/healthz" 2>/dev/null || true

echo
echo "→ Hubs HTML (no Build Error check)"
HUBS="/tmp/lumora_live_quickcheck_hubs.html"
code="$(curl -sS -m 12 -o "$HUBS" -w "%{http_code}" "${BASE}/live/hubs" 2>/dev/null || true)"
echo "HTTP ${code:-000}"
if [ "$code" = "200" ]; then
  if grep -qi "Build Error" "$HUBS" 2>/dev/null; then
    echo "❌ Build Error overlay detected (NON-FATAL)"
  else
    echo "✓ /live/hubs OK"
  fi
else
  echo "❌ /live/hubs not 200 (NON-FATAL)"
fi

echo
echo "→ Room-state smoke"
sh scripts/dev/smoke_live_room_state.sh || true

echo
echo "→ SSE smoke"
sh scripts/dev/smoke_live_sse.sh || true

echo
echo "HOW TO TEST (copy/paste):"
echo "  sh scripts/dev/detect_base.sh"
echo "  sh scripts/dev/live_quickcheck.sh"
echo "  BASE=\$(sh scripts/dev/detect_base.sh) && curl -i \"\$BASE/api/live/room-state?roomId=demo-room\" | head -n 60"
echo "  BASE=\$(sh scripts/dev/detect_base.sh) && curl -i -N \"\$BASE/api/live/events?roomId=demo-room\" | head -n 30"
echo "  BASE=\$(sh scripts/dev/detect_base.sh) && open \"\$BASE/live/hubs\""
exit 0
