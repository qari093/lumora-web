# Lumora — Final Launch Checklist (Step 23/29)

- Timestamp (UTC): `2025-12-25T09:44:22Z`
- PORT: `3000`
- Daemon PID: `40229`
- Daemon Log: `/tmp/lumora_final_prod_daemon_3000.log`

## Required pass conditions (local)

1) Prod daemon running (next start)  
2) /api/health = 200  
3) /, /fyp, /share = 200  
4) /gmar, /nexa, /movies/portal = 200  
5) /api/admin/testers/summary = 200  
6) final:test script passes  

## One-command checks

```bash
# smoke
PORT=3000 npm run -s final:test

# logs
tail -n 200 /tmp/lumora_final_prod_daemon_3000.log

# restart daemon
/tmp/lumora_final_restart_prod_3000.sh
```

## Open

- http://localhost:3000/
- http://localhost:3000/fyp
- http://localhost:3000/share
- http://localhost:3000/gmar
- http://localhost:3000/nexa
- http://localhost:3000/movies/portal
- http://localhost:3000/admin/testers
