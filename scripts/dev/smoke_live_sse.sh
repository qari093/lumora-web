#!/bin/sh
set +e

BASE="$(sh scripts/dev/detect_base.sh 2>/dev/null || true)"
if [ -z "${BASE:-}" ]; then
  echo "ℹ BASE not detected. Start dev then run:"
  echo "   pnpm dev"
  echo "   sh scripts/dev/smoke_live_sse.sh"
  exit 0
fi

HDR="/tmp/lumora_smoke_sse_headers.txt"
BODY="/tmp/lumora_smoke_sse_body_head.txt"
URL="${BASE}/api/live/events?roomId=demo-room"

ok=0
i=1
while [ $i -le 6 ]; do
  # NOTE: curl to SSE often times out after first chunk; that is OK.
  # We just need headers + first event lines.
  curl -sS -m 8 -D "$HDR" -o "$BODY" "$URL" 2>/dev/null || true

  if tr -d '\r' < "$HDR" 2>/dev/null | grep -qi '^content-type: *text/event-stream' \
     && grep -qi 'event: connected' "$BODY" 2>/dev/null; then
    ok=1
    break
  fi

  echo "  attempt ${i}/6 -> SSE markers not found yet (retrying...)"
  i=$((i+1))
  sleep 1
done

echo "✓ BASE=${BASE}"
if [ "$ok" = "1" ]; then
  echo "✓ SSE OK (content-type + connected event present)"
else
  echo "❌ SSE markers missing after retries (NON-FATAL)"
fi
echo "✓ Headers: $HDR"
echo "✓ Body:    $BODY"
exit 0
