# Lumora Boot Sequence Contract (Locked)

This document defines the **canonical, production-locked boot sequence** for Lumora.

## Order (Non-Negotiable)
1. **SplashGate**
   - Once per session
   - Respects prefers-reduced-motion
   - Controlled via durationMs + fadeOutMs
   - Writes session key: `lumora:splash:shown:v1`

2. **BootMark**
   - Marks:
     - `lumora:splash_end`
     - `lumora:first_interactive`
     - `lumora:boot_to_interactive`

3. **App Render**
   - `{children}` (full application)

## Wiring Location
- `app/layout.tsx`

## Change Policy
- Any modification to this sequence requires:
  - Step ID bump
  - Contract update
  - Passing splash vitest suite
  - Explicit operator confirmation

Status: **LOCKED**
