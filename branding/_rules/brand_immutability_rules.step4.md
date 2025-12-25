# Brand Immutability Rules (Step 4)

**Created:** 2025-12-22T09:30:22Z

## Canonical lock artifacts

- Step 1 checksum freeze: `branding/_checksums/logo_checksum_freeze.step1.txt`
- Step 2 spectrum lock:  `branding/_locks/blade_color_spectrum_lock.step2.json`
- Step 3 geometry lock:  `branding/_locks/geometry_lock.step3.json`

## Non-negotiable rules

1) **No logo color changes** after spectrum lock (Step 2).
2) **No blade geometry edits** after geometry lock (Step 3).
3) **No wordmark/text geometry edits** after geometry lock (Step 3).
4) Any asset change requires:
   - new version tag,
   - new pixel-diff baseline,
   - explicit brand sign-off.
5) Locks are **read-only**; pipelines must fail on mismatch.

## Enforcement points

- CI must verify:
  - Step 1 checksums match tracked assets.
  - Step 2 extracted tokens match baseline.
  - Step 3 geometry fingerprints + sha256 match baseline.

## Scope

- Applies to: blade mark, wordmark/text, launch/splash exports, and any derived variants.
