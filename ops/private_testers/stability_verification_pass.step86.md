# Lumora — Stability Verification Pass (Step 86)

Run before expanding beyond initial private testers.

## Checks
- [ ] `npm run -s lint` (if configured) OR skip if not present
- [ ] `npm run -s typecheck` (or `tsc --noEmit`) — must pass for expansion
- [ ] `npm run -s build` — must pass for expansion
- [ ] `/api/health` returns 200
- [ ] Private access middleware works
- [ ] No crash loops observed in splash gate

## Output
Run:
`sh scripts/ops/run_stability_verification.step86.sh`
