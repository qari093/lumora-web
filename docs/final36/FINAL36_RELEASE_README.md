# Final36 — Release README (Checklist Only)

## Preconditions
- [ ] Local env present and valid (`.env*` as needed)
- [ ] DB reachable (if required by runtime)
- [ ] Node tooling installed (pnpm preferred)

## Required CI Gate
- [ ] `pnpm run ci:final36` passes (or `npm run ci:final36`)

## Local Smoke (operator)
- [ ] Start dev server: `pnpm dev`
- [ ] Verify:
  - [ ] `GET /api/health` = 200 JSON
  - [ ] `GET /api/ready`  = 200 JSON
  - [ ] Key portals respond (200 or redirect):
    - [ ] `/fyp`
    - [ ] `/gmar`
    - [ ] `/videos`
    - [ ] `/nexa`
    - [ ] `/movies`
    - [ ] `/live`

## Security Headers (operator)
- [ ] Dev: no `strict-transport-security` header
- [ ] Prod-sim test contract remains green via CI (HSTS suite)

## Regression Guardrails
- [ ] Middleware does not touch `/api/*` routes (health/ready deterministic)
- [ ] No stray heredoc prompts in docs
- [ ] Markdown fences validated

## Completion
- [ ] Marker updated to Final36 step 36 after the last step
