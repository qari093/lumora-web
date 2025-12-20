# Polaroid — Phase 1 Scope + Acceptance Gates (Step 06)

UTC: 2025-12-20T11:50:01Z

## Objective
Move from Phase-0 proof to Phase-1 delivery with strict gates:
- Keep the **one-blade** UX (color tap → instant Polaroid).
- Preserve **hard Day-2 retention gate** and kill/pivot rules.
- Avoid “feature creep” until proof.

## Phase-1 Deliverables (allowed)
1) **Reliability hardening**
   - Deterministic render + save flow
   - Basic offline-safe behavior (no broken state)
2) **Instrumentation**
   - Minimal event logging for: tap → render → save
   - No invasive tracking; keep privacy-first stance
3) **Operational repeatability**
   - Single command to re-run local server
   - Single command to re-issue tunnel URL when needed

## Disallowed in Phase-1
- Weekly digest automation
- Mosaic/anonymous social layer
- Store/monetization
- Any “therapy/medical” claims

## Acceptance Gates (must all pass)
- [ ] iPhone Safari: Tap → Render → Save works
- [ ] Android Chrome: Tap → Render → Save works
- [ ] Local hash frozen for index.html
- [ ] Repo remains clean after each step
- [ ] Resume marker contains single, locked mobile result

## Next
Proceed to Phase-1 Step 07 only after these gates stay green.
