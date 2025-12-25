# Device Matrix Testing (Step 51)

This runbook defines the **minimum device/browser matrix** to validate the Lumora splash/brand integration and cold-start behavior.

## What to validate

### Brand / Splash Gate behavior
- Fallback splash renders immediately (no blank screen).
- SplashGate resolves quickly and fails open.
- Skip/timeout guard behaves correctly.
- Reduced-motion disables non-essential effects.
- Offline start bypasses splash (no blocking).

### Visual checks
- Blade + wordmark look correct on:
  - white / light gray background
  - black / near-black background
- No clipping on safe areas in portrait + landscape.

### Performance checks
- Cold-start splash latency is acceptable.
- No visible stutter during initial render.
- Memory spikes do not crash Safari/iOS.

## Test matrix (minimum)

### iOS
- iPhone 13 / 14 (iOS 17+), Safari
- iPhone 15 / 16 (latest iOS), Safari
- iPad (iPadOS 17+), Safari

### Android
- Pixel 7/8 (Android 14/15), Chrome
- Samsung mid-tier (Android 13+), Chrome
- Low-end Android (2–3 GB RAM), Chrome

### Desktop
- macOS, Chrome (latest)
- macOS, Safari (latest)
- Windows 11, Chrome (latest)
- Windows 11, Edge (latest)

## Execution checklist (per device)
- [ ] Load app cold (hard refresh / kill app browser)
- [ ] Observe first paint (fallback splash) within 1s
- [ ] Confirm SplashGate reaches `phase=done`
- [ ] Toggle OS reduced-motion → splash should shorten / become static
- [ ] Toggle airplane mode before load → app must still proceed (offline bypass)
- [ ] Rotate portrait/landscape → center-in-safe-area preserved
- [ ] Repeat 3x to catch nondeterministic issues

## Artifacts to capture
- Screenshot: splash in dark + light
- Short screen recording (3–5s) for any stutter
- Console logs (if available)
- Note device model, OS version, browser version

