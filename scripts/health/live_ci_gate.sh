#!/bin/sh
set -euo pipefail
cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

echo "Live CI Gate — START"
BASE="${BASE:-http://127.0.0.1:3000}"
export BASE
NODEV="$(node -v 2>/dev/null || true)"
MAJ="$(printf "%s" "$NODEV" | sed -E "s/^v([0-9]+).*/\1/")"
if [ "$MAJ" != "20" ]; then
  echo "❌ Live CI must run under Node 20.x (got $NODEV)"
  echo "• Fix:"
  echo "  pnpm -s run with:node20 -- sh scripts/health/live_ci_gate.sh"
  exit 2
fi

echo "BASE=${BASE}"

# Ensure BASE is exported for child processes (vitest reads process.env.BASE)
export BASE
export npm_package_config_base="$BASE"

# Auto-detect BASE if not provided (needed for vitest contract tests)
if [ -z "${BASE:-}" ]; then
  DETECTED="$(sh scripts/dev/detect_base.sh 2>/dev/null || true)"
  if [ -n "${DETECTED:-}" ]; then

    export BASE
    echo "BASE(auto)=${BASE}"
  fi
fi

# Hard fail if still empty (tests require BASE)
if [ -z "${BASE:-}" ]; then
  echo "❌ BASE unresolved. Start dev and/or set BASE=http://127.0.0.1:3000"
  exit 1
fi

fail=0

req() {
  name="$1"
  url="$2"
  expect_code="$3"
  out="$4"
  echo "→ ${name}"
  code="$(curl -sS -m 12 -o "${out}" -w "%{http_code}" "${url}" || echo "000")"
  echo "  HTTP ${code}"
  if [ "${code}" != "${expect_code}" ]; then
    echo "  ❌ expected ${expect_code}"
    fail=1
  fi
}

# 1) healthz
req "GET /live/healthz" "${BASE}/live/healthz" "200" "/tmp/live_ci_healthz.txt"

# 2) hubs must not contain Build Error
req "GET /live/hubs" "${BASE}/live/hubs" "200" "/tmp/live_ci_hubs.html"
if grep -qi "Build Error" /tmp/live_ci_hubs.html 2>/dev/null; then
  echo "  ❌ Build Error overlay detected in /live/hubs"
  fail=1
else
  echo "  ✓ no Build Error overlay"
fi

# 3) persona manifest must contain emojis array
req "GET /api/persona/manifest" "${BASE}/api/persona/manifest" "200" "/tmp/live_ci_persona_manifest.json"
if ! grep -qi '"emojis"' /tmp/live_ci_persona_manifest.json 2>/dev/null; then
  echo "  ❌ persona manifest missing 'emojis'"
  fail=1
fi

# 4) room-state should be ok:true
req "GET /api/live/room-state?roomId=demo-room" "${BASE}/api/live/room-state?roomId=demo-room" "200" "/tmp/live_ci_room_state.json"
if ! grep -qi '"ok":true' /tmp/live_ci_room_state.json 2>/dev/null; then
  echo "  ❌ room-state missing ok:true"
  fail=1
fi

# 5) publish event and ensure room-state updates lastEventAt
echo "→ POST /api/live/publish (kind=event)"
pub_out="/tmp/live_ci_publish.json"
pub_code="$(printf '{"roomId":"demo-room","kind":"event"}' | curl -sS -m 12 -o "${pub_out}" -w "%{http_code}" -H "content-type: application/json" -d @- "${BASE}/api/live/publish" || echo "000")"
echo "  HTTP ${pub_code}"
if [ "${pub_code}" != "200" ]; then
  echo "  ❌ publish not 200"
  fail=1
else
  echo "  ✓ publish 200"
fi

echo "→ Re-check room-state lastEventAt"
req "GET /api/live/room-state?roomId=demo-room" "${BASE}/api/live/room-state?roomId=demo-room" "200" "/tmp/live_ci_room_state_after.json"
if ! grep -qi '"lasteventat":' /tmp/live_ci_room_state_after.json 2>/dev/null; then
  echo "  ❌ room-state missing lastEventAt after publish"
  fail=1
fi

# 6) SSE smoke (connected + event)
echo "→ SSE smoke /api/live/events?roomId=demo-room (deterministic)"
SSE_ROOM="${SSE_ROOM:-demo-room}"
SSE_TIMEOUT="${SSE_TIMEOUT:-8}"
SSE_URL="$BASE/api/live/events?roomId=$SSE_ROOM"
SSE_OUT="/tmp/lumora_live_ci_sse_det_${SSE_ROOM}.txt"
: >"$SSE_OUT"

# Start SSE capture (bounded) in background
curl -sS -i -N --no-buffer --max-time "$SSE_TIMEOUT" "$SSE_URL" >"$SSE_OUT" 2>/dev/null &
SSE_PID=$!

# Give the stream a moment to connect, then publish an event
sleep 0.35
SSE_DATA="$(printf '{"roomId":"%s","kind":"event","payload":{"msg":"ci"}}' "$SSE_ROOM")"
curl -sS -X POST "$BASE/api/live/publish" -H "content-type: application/json" \
  --data "$SSE_DATA" >/dev/null 2>&1 || true

# Wait a bit for delivery, then ensure we stop the capture
sleep 0.9
if kill -0 "$SSE_PID" 2>/dev/null; then kill "$SSE_PID" 2>/dev/null || true; fi
wait "$SSE_PID" 2>/dev/null || true

# Verify connected + event present (strict)
low="$(tr '[:upper:]' '[:lower:]' <"$SSE_OUT" | head -c 200000)"
echo "$low" | grep -q "http/1.1 200" || { echo "  ❌ SSE did not return HTTP 200"; head -n 40 "$SSE_OUT" || true; exit 2; }
echo "$low" | grep -q "event: connected" || { echo "  ❌ SSE missing connected event"; head -n 80 "$SSE_OUT" || true; exit 2; }
echo "$low" | grep -q "event: event" || { echo "  ❌ SSE missing published event"; head -n 120 "$SSE_OUT" || true; exit 2; }
echo "  ✓ SSE connected"
echo "  ✓ SSE received published event"
echo "→ Portal smoke suite (GETs + retry + longer timeout + content guards)"
PORTAL_BASE="${BASE:-http://127.0.0.1:3000}"
SMOKE_TIMEOUT="${SMOKE_TIMEOUT:-10}"
SMOKE_RETRY_DELAY="${SMOKE_RETRY_DELAY:-0.7}"
smoke_get(){
  path="$1"; label="$2";
  tmp="/tmp/lumora_portal_smoke_body.txt"
  hdr="/tmp/lumora_portal_smoke_headers.txt"
  code="000"
  for try in 1 2; do
    : >"$tmp"; : >"$hdr";
    code="$(curl -sS -D "$hdr" -o "$tmp" -w "%{http_code}" --max-time "$SMOKE_TIMEOUT" "$PORTAL_BASE$path" || true)"
    if [ "$code" = "200" ] || [ "$code" = "204" ] || [ "$code" = "302" ] || [ "$code" = "307" ] || [ "$code" = "308" ]; then
      # If HTML, ensure we did not land on a Next error overlay/build error page.
      ct="$(tr -d "\r" <"$hdr" | awk -F": " 'tolower($1)=="content-type"{print tolower($2)}' | head -n1)"
      if echo "$ct" | grep -q "text/html"; then
        low="$(tr '[:upper:]' '[:lower:]' <"$tmp" | head -c 40000)"
        if echo "$low" | grep -q "build error"; then
          echo "  ❌ $label ($path) HTTP $code (try $try) — Build Error page detected" ; exit 2
        fi
        if echo "$low" | grep -q "application error"; then
          echo "  ❌ $label ($path) HTTP $code (try $try) — Application error detected" ; exit 2
        fi
        if echo "$low" | grep -q "internal server error"; then
          echo "  ❌ $label ($path) HTTP $code (try $try) — 500-ish HTML detected" ; exit 2
        fi
      fi
      echo "  ✓ $label ($path) HTTP $code (try $try)"
      return 0
    fi
    if [ "$code" = "000" ] && [ "$try" -lt 2 ]; then
      sleep "$SMOKE_RETRY_DELAY"
      continue
    fi
    break
  done
  echo "  ❌ $label ($path) HTTP $code"
  echo "  — headers (first 20) —"
  tr -d "\r" <"$hdr" | sed -n "1,20p" 2>/dev/null
  echo "  — body head —"
  head -c 520 "$tmp" 2>/dev/null
  echo
  exit 2
}

# Startup splash / root shell
smoke_get "/" "startup/root"

# Portals (best-effort paths; adjust later if your router uses different slugs)
smoke_get "/live" "Live portal"
smoke_get "/gmar" "GMAR portal"
smoke_get "/videos" "Videos portal"
smoke_get "/nexa" "NEXA portal"
smoke_get "/movies" "Movies portal"
smoke_get "/celebrations" "Celebrations portal"
smoke_get "/share" "Share portal"
smoke_get "/fyp" "FYP portal"
# === /PORTAL SMOKE SUITE (step62) ===

# === PORTAL API GUARDS (step65) ===
echo "→ Portal API guards (fast JSON/status checks)"
API_BASE="${BASE:-http://127.0.0.1:3000}"
API_TIMEOUT="${API_TIMEOUT:-6}"
api_get(){
  path="$1"; label="$2"; expect="${3:-}";
  hdr="/tmp/lumora_portal_api_headers.txt"; body="/tmp/lumora_portal_api_body.txt";
  : >"$hdr"; : >"$body";
  code="$(curl -sS -D "$hdr" -o "$body" -w "%{http_code}" --max-time "$API_TIMEOUT" "$API_BASE$path" || true)"
  if [ "$code" != "200" ]; then
    echo "  ❌ $label ($path) HTTP $code"
    echo "  — headers (first 20) —"; tr -d "\r" <"$hdr" | sed -n "1,20p" 2>/dev/null
    echo "  — body head —"; head -c 520 "$body" 2>/dev/null || true; echo
    exit 2
  fi
  if [ -n "${expect:-}" ]; then
    low="$(tr '[:upper:]' '[:lower:]' <"$body" | head -c 20000)"
    echo "$low" | grep -q "$expect" || {
      echo "  ❌ $label ($path) missing expected token: $expect"
      echo "  — body head —"; head -c 520 "$body" 2>/dev/null || true; echo
      exit 2
    }
  fi
  echo "  ✓ $label ($path) HTTP 200"
}

# Live core APIs
api_get "/api/live/healthz" "live healthz" '"ok":true'
api_get "/api/live/rooms" "live rooms" '"ok":true'
api_get "/api/live/portal-hubs" "live portal-hubs" '"ok":true'
api_get "/api/live/health-badge" "live health-badge" '"ok":true'

# Persona manifest (used by portals/splash + UI)
api_get "/api/persona/manifest" "persona manifest" '"ok":true'

  # --- Portal minimal APIs (soft-launch safe, fast) ---
  # GMAR
  api_get "/api/gmar/healthz" "gmar healthz" '"ok":true'
  api_get "/api/gmar/home" "gmar home" '"ok":true'

  # Videos
  api_get "/api/videos/healthz" "videos healthz" '"ok":true'
  api_get "/api/videos/feed" "videos feed" '"ok":true'

  # NEXA
  api_get "/api/nexa/healthz" "nexa healthz" '"ok":true'
  api_get "/api/nexa/status" "nexa status" '"ok":true'

  # Movies
  api_get "/api/movies/healthz" "movies healthz" '"ok":true'
  api_get "/api/movies/catalog" "movies catalog" '"ok":true'

  # Celebrations
  api_get "/api/celebrations/healthz" "celebrations healthz" '"ok":true'
  api_get "/api/celebrations/manifest" "celebrations manifest" '"ok":true'

  # Share
  api_get "/api/share/healthz" "share healthz" '"ok":true'

  # FYP
  api_get "/api/fyp/healthz" "fyp healthz" '"ok":true'
  api_get "/api/fyp/feed" "fyp feed" '"ok":true'

# === /PORTAL API GUARDS (step65) ===
echo "Live CI Gate — OK"
exit 0
