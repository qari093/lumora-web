# Polaroid Phase-1 — Tunnel Smoke HTTP 530 RCA (Step 80)

- UTC: 2025-12-20T14:00:55Z
- LIVE_URL: https://erp-been-photographs-machinery.trycloudflare.com/polaroid-mvp/index.html
- Host: erp-been-photographs-machinery.trycloudflare.com
- Path: /polaroid-mvp/index.html

## What HTTP 530 likely means (in this context)
- Cloudflare responded but could not reach/validate the origin for the request.
- Common causes: origin not running, tunnel not alive, path mismatch, or transient edge state.

## Hard checks (run on Mac Terminal)
```bash
curl -sS -o /dev/null -w 'LOCAL_HEALTH=%{http_code}
' http://127.0.0.1:8088/polaroid-mvp/health
curl -sS -o /dev/null -w 'LOCAL_PAGE=%{http_code}
'  http://127.0.0.1:8088/polaroid-mvp/index.html
lsof -nP -iTCP:8088 -sTCP:LISTEN || true
pgrep -fl cloudflared || true
```

## If DNS is flaky but tunnel works, verify via forced resolve
```bash
# Example (replace HOST and IP):
# dig +short HOST
# curl --resolve HOST:443:IP https://HOST/PATH
dig +short erp-been-photographs-machinery.trycloudflare.com || true
```

## Decision
- If LOCAL_HEALTH=200 and LOCAL_PAGE=200, re-issue quick tunnel and proceed.
