# Lumora — Re-test Protocol (Step 84)

Goal: Re-test with the same users after polish/pauses to confirm improvements.

## Before retest
- Ensure private access is active (Steps 61–62).
- Choose 3–5 tasks max (short, repeatable).
- Prepare device/browser info.

## Retest tasks (example)
1) Open app from cold start and reach a portal.
2) Complete 1 basic loop (scroll/feed OR open GMAR OR open video-gen page).
3) Trigger one interaction (like/comment placeholder if present).
4) Recover: refresh page / back / offline toggle.

## Success criteria
- No hard stops (P0).
- Time-to-first-usable feels faster or equal.
- Reported friction items reduced.

## Output
Use the capture script:
- `sh scripts/ops/capture_retest_session.step84.sh`
