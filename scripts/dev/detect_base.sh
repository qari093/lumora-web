#!/bin/sh
set +e
# Prints base URL like http://127.0.0.1:3000 or empty if none.
if [ -n "${BASE:-}" ]; then
  echo "$BASE"
  exit 0
fi

host="${HOST:-127.0.0.1}"
start="${PORT_START:-3000}"
end="${PORT_END:-3010}"

p="$start"
while [ "$p" -le "$end" ]; do
  code="$(curl -sS -m 2 -o /dev/null -w "%{http_code}" "http://${host}:${p}/live/healthz" 2>/dev/null || true)"
  [ -n "$code" ] || code="000"
  if [ "$code" = "200" ]; then
    echo "http://${host}:${p}"
    exit 0
  fi
  p=$((p+1))
done

exit 0
