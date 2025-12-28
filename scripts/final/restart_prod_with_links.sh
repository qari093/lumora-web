#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
HOST="127.0.0.1"
BASE="http://${HOST}:${PORT}"

echo "Lumora — restart prod (PORT=${PORT})"
echo "──────────────────────────────────────────────────────────────"

curl_retry_200() {
  url="$1"
  tries="${2:-90}"
  i=0
  while [ "$i" -lt "$tries" ]; do
    code="$(curl -sS --retry 0 --retry-connrefused -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || true)"
    [ "$code" = "200" ] && return 0
    i=$((i+1))
    sleep 0.2
  done
  return 1
}

kill_existing() {
  # best-effort: stop any existing prod server started by this script
  if [ -f /tmp/lumora-prod.pid ]; then
    pid="$(cat /tmp/lumora-prod.pid 2>/dev/null || true)"
    if [ -n "${pid:-}" ] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      sleep 0.5
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f /tmp/lumora-prod.pid || true
  fi
}

start_prod() {
  kill_existing

  # ensure clean port
  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
    if [ -n "${pids:-}" ]; then
      echo "• Port ${PORT} busy -> killing: $pids"
      # shellcheck disable=SC2086
      kill $pids 2>/dev/null || true
      sleep 0.5
      # shellcheck disable=SC2086
      kill -9 $pids 2>/dev/null || true
    fi
  fi

  echo "• Starting prod server (next start -p ${PORT})"
  : >/tmp/lumora-prod.out
  nohup sh -c "PORT=${PORT} npx next start -p ${PORT}" >/tmp/lumora-prod.out 2>&1 &
  echo "$!" >/tmp/lumora-prod.pid
}

open_url() {
  u="$1"
  if command -v open >/dev/null 2>&1; then
    open "$u" >/dev/null 2>&1 && return 0
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$u" >/dev/null 2>&1 && return 0
  fi
  return 1
}

smoke_200() {
  path="$1"
  code="$(curl -sS --retry 0 --retry-connrefused -o /dev/null -w '%{http_code}' "${BASE}${path}" 2>/dev/null || true)"
  [ "$code" = "200" ] || { echo "❌ ${path} -> ${code:-unknown}"; exit 8; }
  echo "✓ ${path} -> 200"
}

start_prod

echo "• Readiness gate: /api/health"
curl_retry_200 "${BASE}/api/health" || {
  echo "❌ Not ready: /api/health did not return 200"
  echo "• Tail /tmp/lumora-prod.out:"
  tail -n 120 /tmp/lumora-prod.out 2>/dev/null || true
  exit 9
}
echo "✓ Ready: /api/health -> 200"
echo "──────────────────────────────────────────────────────────────"

echo "Lumora Final Smoke (PORT=${PORT})"
smoke_200 "/api/health"
smoke_200 "/"
smoke_200 "/fyp"
smoke_200 "/videos"
smoke_200 "/watch/demo-1"
smoke_200 "/gmar"
smoke_200 "/nexa"
smoke_200 "/movies/portal"
smoke_200 "/celebrations"
smoke_200 "/share"
smoke_200 "/live"
smoke_200 "/portals"
smoke_200 "/install/portals-qr.png"
smoke_200 "/lumexa"
smoke_200 "/lumexa/chat"
smoke_200 "/lumexa/search"
smoke_200 "/lumexa/shop"
smoke_200 "/lumen"
echo

CORE="$(cat <<URLS
http://localhost:${PORT}/portals
http://localhost:${PORT}/install/portals-qr.png
http://localhost:${PORT}/fyp
http://localhost:${PORT}/videos
http://localhost:${PORT}/gmar
http://localhost:${PORT}/nexa
http://localhost:${PORT}/movies/portal
http://localhost:${PORT}/celebrations
http://localhost:${PORT}/share
http://localhost:${PORT}/live
http://localhost:${PORT}/lumexa
http://localhost:${PORT}/lumen
URLS
)"

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
if [ -z "${LAN_IP:-}" ] && command -v hostname >/dev/null 2>&1; then
  LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
fi


maybe_open(){
  u="$1"
  if command -v open >/dev/null 2>&1; then
    open "$u" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$u" >/dev/null 2>&1 || true
  else
    :
  fi
}

echo "OPEN (Core):"
printf "  %s\n" $CORE
echo

if [ -n "${LAN_IP:-}" ]; then
  echo "OPEN (LAN):"
  echo "$CORE" | sed "s#http://localhost:${PORT}#http://${LAN_IP}:${PORT}#g" | awk '{print "  " $0}'
  echo
fi

opened=0
for u in $CORE; do
  if open_url "$u"; then opened=$((opened+1)); fi
done

if [ "$opened" -gt 0 ]; then
  echo "✓ Opened ${opened} URLs"
else
  echo "ℹ Could not auto-open URLs (no open/xdg-open). Copy/paste from OPEN (Core)."
fi

echo
echo "Lumora — restart prod with links — done"
