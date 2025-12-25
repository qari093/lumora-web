# Lumora Brand + Splash Integration Snapshot (Step 56)

**Version tag:** `lumora-brand-v1-24ae4458da22`  
**Created:** `2025-12-22T11:50:43Z`

---

## Locks (immutability)

- Step 1 — Checksums  
  `branding/_checksums/logo_checksum_freeze.step1.txt`

- Step 2 — Blade color spectrum lock  
  `branding/_locks/blade_color_spectrum_lock.step2.json`

- Step 3 — Geometry lock (blade + text)  
  `branding/_locks/geometry_lock.step3.json`

- Step 4 — Brand immutability rules  
  `branding/_locks/brand_immutability_rules.step4.md`

---

## Baselines & exports

- Step 5 — Pixel baseline exports  
  `branding/_baseline/pixel_diff_baseline.step5.json`

- Step 6 — Master RGBA exports  
  `branding/_exports/master_rgba_export.step6.json`

- Step 7 — Background compatibility previews  
  `branding/_validation/background_compatibility.step7.json`

- Step 23 — Mobile icon exports  
  `branding/_icons/mobile_icon_exports.step23.json`

- Step 24 — App launch animation frame exports  
  `branding/_launch/app_launch_animation_export.step24.json`

- Step 25 — Fallback splash exports  
  `branding/_launch/fallback_splash_export.step25.json`

- Step 26 — Low-end device fallback package  
  `branding/_launch/low_end_fallback/low_end_fallback_build.step26.json`

- Step 27 — Resolution variants  
  `branding/_launch/frames_variants/resolution_variants.step27.json`

- Step 28 — Orientation-safe layout spec  
  `branding/_launch/layout/orientation_safe_layout.step28.json`

- Step 29 — Transparency handling validation  
  `branding/_validation/transparency_handling_validation.step29.json`

- Step 30 — Size budget enforcement  
  `branding/_validation/size_budget_enforcement.step30.json`

---

## Animation configuration (frozen)

- Step 9 — Reveal choreography  
  `branding/_animation/reveal_choreography.step9.json`

- Step 10 — Blade-as-mask confirmation  
  `branding/_animation/blade_as_mask_confirmation.step10.json`

- Step 11 — Text emergence timing map  
  `branding/_animation/text_emergence_timing_map.step11.json`

- Step 12 — Particle boundary  
  `branding/_animation/energy_particle_boundary.step12.json`

- Step 15 — Motion engine selection  
  `branding/_animation/motion_engine_selection.step15.json`

- Step 16 — Locked blade layer  
  `branding/_layers/blade.locked.svg`

- Step 17 — Mask layer  
  `branding/_layers/blade.mask.svg`

- Step 18 — Light sweep previews  
  `branding/_animation/light_sweep_integration.step18.json`

- Step 19 — External particle system previews  
  `branding/_animation/external_particle_system.step19.json`

- Step 20 — Typography reveal previews  
  `branding/_animation/typography_reveal_animation.step20.json`

- Step 21 — Motion curve tuning  
  `branding/_animation/motion_curve_tuning.step21.json`

- Step 22 — Frame budget optimization  
  `branding/_animation/frame_budget_optimization.step22.json`

- Step 54 — Animation freeze manifest  
  `branding/_validation/animation_freeze.step54.json`

---

## Runtime wiring (web)

- Step 31 — App launch hook wiring  
  `app/layout.tsx`

- Step 32 — Cold-start splash binding  
  `app/_client/brand/SplashGate.tsx`

- Step 33 — OS splash compliance readiness  
  `branding/_validation/os_splash_compliance_check.step33.json`

- Steps 37–45 — lifecycle, guards, telemetry  
  `app/_client/brand/SplashGate.tsx`

---

## Visual + accessibility checks

- Step 48 — Color histogram verification  
  `branding/_validation/color_histogram_verification.step48.json`

- Step 49 — Dark-mode appearance previews  
  `branding/_validation/dark_mode_appearance.step49.json`  
  Previews: `branding/_validation/dark_mode/`

- Step 50 — Accessibility contrast check  
  `branding/_validation/accessibility_contrast_check.step50.json`

---

## QA & sign-off

- Step 51 — Device matrix runbook  
  `branding/_validation/device_matrix_testing.step51.md`

- Step 52 — OS version coverage policy  
  `branding/_validation/os_version_coverage.step52.json`

- Step 53 — Brand sign-off sheet  
  `branding/_validation/brand_signoff.step53.md`

