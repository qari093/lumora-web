#!/usr/bin/env bash
set -e

PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"
JAR="$(mktemp)"

function set_role() {
  ROLE="$1"
  curl -s -X POST "$BASE/api/auth/set-role" \
    -H "content-type: application/json" \
    -d "{\"role\":\"$ROLE\",\"name\":\"$ROLE-user\"}" -c "$JAR" >/dev/null
}

function hit() {
  PATH_="$1"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$PATH_" -b "$JAR" -L)
  printf "%-11s -> %-18s : %s\n" "$ROLE" "$PATH_" "$code"
}

# ensure dev is running
pkill -f "next dev" >/dev/null 2>&1 || true
nohup npx next dev > /tmp/next-dev.out 2>&1 & disown
sleep 6

# Test matrix
for ROLE in guest user advertiser creator moderator admin; do
  set_role "$ROLE"
  hit "/dash/user"
  hit "/dash/advertiser"
  hit "/dash/creator"
  hit "/dash/moderator"
  hit "/dash/admin"
  echo "----"
done

echo "Open: $BASE/auth/login"
