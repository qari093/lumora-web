#!/bin/sh
set -euo pipefail

cd "${LUMORA_ROOT:-$HOME/lumora-web}"
PORT="${PORT:-3040}"
OUT="${OUT:-/tmp/lumora_nexa_ops.json}"
LOG="${LOG:-/tmp/lumora_dev_3040.log}"

base="http://127.0.0.1:${PORT}"

# best-effort: ensure server up, but never fail export
if [ -f "scripts/dev/ensure_up.sh" ]; then
  PORT="$PORT" sh scripts/dev/ensure_up.sh >/dev/null 2>&1 || true
fi

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

get() {
  path="$1"
  curl -sS --max-time 8 --retry 1 --retry-delay 1 -D /tmp/lumora_nexa_export_headers.txt "${base}${path}" \
    -o /tmp/lumora_nexa_export_body.json >/dev/null 2>&1 || return 1
  code="$(tr -d '\r' < /tmp/lumora_nexa_export_headers.txt | awk 'NR==1{print $2}' 2>/dev/null || true)"
  rid="$(tr -d '\r' < /tmp/lumora_nexa_export_headers.txt | awk -F': ' 'tolower($1)=="x-request-id"{print $2}' | tail -n1 2>/dev/null || true)"
  rlrem="$(tr -d '\r' < /tmp/lumora_nexa_export_headers.txt | awk -F': ' 'tolower($1)=="x-ratelimit-remaining"{print $2}' | tail -n1 2>/dev/null || true)"
  printf '%s\n' "{\"ok\":true,\"status\":${code:-0},\"x_request_id\":\"${rid:-}\",\"x_ratelimit_remaining\":\"${rlrem:-}\",\"body\":$(cat /tmp/lumora_nexa_export_body.json 2>/dev/null || echo 'null')}"
}

health="$(get /api/nexa/health || echo '{"ok":false}')"
metrics="$(get /api/nexa/metrics || echo '{"ok":false}')"
diag="$(get /api/nexa/diag || echo '{"ok":false}')"
info="$(get /api/nexa/info || echo '{"ok":false}')"
index="$(get /api/nexa || echo '{"ok":false}')"

# log tail (best-effort, small)
tail20="[]"
if [ -f "$LOG" ]; then
  # json escape minimal (replace backslash + quote)
  t="$(tail -n 20 "$LOG" | sed 's/\\/\\\\/g; s/"/\\"/g')"
  tail20="$(printf '%s\n' "$t" | awk 'BEGIN{print "["} {printf "%s\"%s\"", (NR==1?"":","), $0} END{print "]"}')"
fi

cat > "$OUT" <<JSON
{
  "ts": "${ts}",
  "port": ${PORT},
  "base": "${base}",
  "routes": {
    "health": ${health},
    "metrics": ${metrics},
    "diag": ${diag},
    "info": ${info},
    "index": ${index}
  },
  "log_tail_20": ${tail20}
}
JSON

echo "✓ wrote: $OUT"
