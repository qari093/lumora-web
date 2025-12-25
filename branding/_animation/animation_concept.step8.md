# Logo Animation Concept — Final (Step 8)

**Created:** 2025-12-22T09:40:32Z

## Non-negotiables

- No logo color changes (Step 2 lock).
- No blade geometry edits (Step 3 lock).
- No wordmark geometry edits (Step 3 lock).
- Blade layer treated as read-only; animation uses masking/light/particles only.

## Concept

A minimal, brand-safe reveal built from three layers:

1) **Blade presence (static geometry)**
   - Blade appears immediately at t=0 (or within first 100ms).
   - No deformation. No warping. No rotation beyond subtle camera/scene motion.

2) **Energy sweep (light pass) + mask-driven reveal**
   - A soft light sweep traverses the blade edge and acts as the trigger for text emergence.
   - Sweep is additive/overlay only; it must not change the underlying blade colors.

3) **Particles (bounded, external system)**
   - Particles remain outside/around the blade boundary.
   - Particles never occlude or alter the blade fill.
   - Density is capped for mobile (frame budget friendly).

## Output targets

- App cold-start splash animation (web + native exports later).
- Static icon exports (separate steps).
- Fallback splash (static) for low-end devices.

## Acceptance checklist

- No edits to locked assets/files.
- Animation looks identical on white/black/mid backgrounds (Step 7 previews).
- Motion is smooth at 60fps on mid-tier devices; no stutter bursts.
- Total duration: short, skippable, timeout-guarded (handled in later steps).
