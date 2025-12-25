# Lumora — Controlled Expansion Policy (Step 88)

## Goal
Increase private testers safely without destabilizing the system.

## Rules (non-negotiable)
- Feature freeze remains active (Step 59): only stability / safety / performance / UX blockers.
- Private access remains required (Step 61–62). Never share token publicly.
- Logging remains minimal: telemetry/errors/abuse are "silent" unless explicitly changed.

## Expansion gating (must pass)
- Security & data sanity report exists (Step 87).
- Stability verification has been run recently (Step 86) and issues reviewed.
- Backup snapshot exists (Step 73) OR created immediately before expansion.
- Private tester onboarding docs exist (Step 74–75).

## Rollout pacing
- Expand in small cohorts.
- Wait for at least 24h of usage signals between cohorts.
- If critical errors increase, stop expansion and revert to smaller cohort.

## Stop conditions
- Build fails repeatedly.
- Crash loop observed.
- Private access bypass/weakness discovered.
- Any secrets leak suspected (token in logs/git).
