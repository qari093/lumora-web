# Polaroid — Phase 1 Guardrails Checklist (Step 05)

UTC: 2025-12-20T11:47:06Z

This checklist is the operator gate before implementing Phase-1 features.

## 1) Proof Baseline (Phase 0)
- [ ] Phase-0 proof doc exists: docs/polaroid/phase0/polaroid-phase0-proof.md
- [ ] Live URL file exists: polaroid-mvp/LIVE_URL.txt
- [ ] Mobile validation locked in marker (single result)
- [ ] index.html sha256 recorded in marker

## 2) Runtime Safety
- [ ] Local server command is repeatable and documented
- [ ] Tunnel is re-issuable (quick tunnel allowed for MVP only)
- [ ] DNS failures have a fallback procedure (wait + re-issue)

## 3) Repo Hygiene
- [ ] Working tree remains clean after every step
- [ ] Any .bak / generated artifacts are either committed intentionally or removed
- [ ] Marker remains append-only (no edits beyond step scripts)

## 4) Next Step Gate
- [ ] Confirm Phase-1 step sequence is active (this track)
- [ ] Continue only via /tmp/phase_step.sh scripts
