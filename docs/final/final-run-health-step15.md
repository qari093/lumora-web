# Lumora — Final Run Health Snapshot (Step 15/29)

- Timestamp (UTC): `2025-12-25T09:33:55Z`
- PORT: `3000`
- Daemon PID: `28125`
- Daemon Log: `/tmp/lumora_final_prod_daemon_3000.log`

## Endpoint Smoke (HTTP status)
- `GET /` → **200**
- `GET /api/health` → **200**
- `GET /api/healthz` → **200**
- `GET /fyp` → **200**
- `GET /share` → **200**
- `GET /gmar` → **200**
- `GET /nexa` → **200**
- `GET /movies/portal` → **200**
- `GET /api/admin/testers/summary` → **200**

## Operator Commands (local)
```bash
# view logs
tail -n 200 /tmp/lumora_final_prod_daemon_3000.log

# stop daemon
kill $(cat /tmp/lumora_final_prod_daemon_3000.pid)

# start daemon (re-run Final Step 14)
```

## Open
- http://localhost:3000/
- http://localhost:3000/fyp
- http://localhost:3000/share
- http://localhost:3000/gmar
- http://localhost:3000/nexa
- http://localhost:3000/movies/portal
