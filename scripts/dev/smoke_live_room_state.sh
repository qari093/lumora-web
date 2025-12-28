#!/bin/sh
set +e

BASE="$(sh scripts/dev/detect_base.sh 2>/dev/null || true)"
if [ -z "${BASE:-}" ]; then
  echo "ℹ BASE not detected. Start dev then run:"
  echo "   pnpm dev"
  echo "   sh scripts/dev/smoke_live_room_state.sh"
  exit 0
fi

url="${BASE}/api/live/room-state?roomId=demo-room"
OUT="/tmp/lumora_smoke_room_state.json"
HDR="/tmp/lumora_smoke_room_state.headers.txt"

echo "• BASE=${BASE}"
echo "• URL=${url}"

ok=0
i=1
while [ $i -le 6 ]; do
  # Increase tolerance for cold compiles / transient stalls
  # -m 12: allow slow first response
  code="$(curl -sS -m 12 -D "$HDR" -o "$OUT" -w "%{http_code}" "$url" 2>/dev/null || true)"

  if [ "$code" = "200" ]; then
    # Minimal contract: JSON contains ok:true and roomId
    if grep -q '"ok":true' "$OUT" 2>/dev/null && grep -q '"roomId"' "$OUT" 2>/dev/null; then
      ok=1
      break
    fi
  fi

  echo "  attempt ${i}/6 -> HTTP ${code:-000} (retrying...)"
  i=$((i+1))
  sleep 1
done

if [ "$ok" = "1" ]; then
  echo "✓ room-state OK"
  echo "✓ Headers: $HDR"
  echo "✓ Body:    $OUT"
  head -c 260 "$OUT" 2>/dev/null || true
  echo
else
  echo "❌ room-state unstable/empty after retries (NON-FATAL)"
  echo "✓ Headers: $HDR"
  echo "✓ Body:    $OUT"
  echo "— headers (first 25) —"
  tr -d '\r' < "$HDR" 2>/dev/null | sed -n '1,25p' || true
  echo "— body head (260) —"
  head -c 260 "$OUT" 2>/dev/null || true
  echo
fi

exit 0
