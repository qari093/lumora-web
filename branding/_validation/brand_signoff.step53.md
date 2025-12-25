# Brand Sign-Off (Step 53)

This checklist is the **final brand approval gate** for the Lumora logo + splash integration.

## Locked brand artifacts
- Step 1 — Checksums: `branding/_checksums/logo_checksum_freeze.step1.txt`
- Step 2 — Blade spectrum: `branding/_locks/blade_color_spectrum_lock.step2.json`
- Step 3 — Geometry lock: `branding/_locks/geometry_lock.step3.json`
- Step 4 — Immutability rules: `branding/_locks/brand_immutability_rules.step4.md`

## Render/export artifacts
- Step 5 — Pixel baseline: `branding/_baseline/pixel_diff_baseline.step5.json`
- Step 6 — Master RGBA exports: `branding/_exports/master_rgba_export.step6.json`
- Step 7 — Background previews: `branding/_validation/background_compatibility.step7.json`
- Step 24 — Launch frames: `branding/_launch/app_launch_animation_export.step24.json`
- Step 25 — Fallback splashes: `branding/_launch/fallback_splash_export.step25.json`
- Step 23 — Mobile icons: `branding/_icons/mobile_icon_exports.step23.json`

## Runtime wiring artifacts
- Step 31 — App launch hook: patched `app/layout.tsx`
- Step 32 — Cold-start binding: patched `app/_client/brand/SplashGate.tsx`
- Step 33 — OS compliance readiness: `branding/_validation/os_splash_compliance_check.step33.json`
- Step 37–45 — lifecycle, guards, telemetry: patched `app/_client/brand/SplashGate.tsx`

## Visual verification
- [ ] Blade shape is unchanged (geometry lock holds).
- [ ] No blade recolor (spectrum lock holds).
- [ ] Wordmark reveal respects timing map.
- [ ] Dark-mode previews acceptable:
  - `branding/_validation/dark_mode/*`
- [ ] Background compatibility previews acceptable:
  - `branding/_validation/preview_*`

## Performance & safety
- [ ] Splash always fails open (never blocks app).
- [ ] Reduced-motion shortens/uses static.
- [ ] Offline bypass works.
- [ ] No crash loop observed across device matrix.

## Sign-off
- Brand: ____________________  Date: __________
- Frontend: _________________  Date: __________
- QA/Operator: ______________  Date: __________

