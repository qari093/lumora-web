
# Quick start
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=${PORT:-3000} npx next dev >/tmp/next-dev.out 2>&1 & disown
sleep 4; tail -n 30 /tmp/next-dev.out || true

