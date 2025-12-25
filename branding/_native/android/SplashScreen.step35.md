# Android SplashScreen Integration (Step 35)

This step scaffolds the **Android SplashScreen asset mapping** for Lumora.

## Assets to use (from branding pipeline)

- Fallback splash PNGs:
  - `branding/_launch/fallback_png/fallback_1080x1920.png` (good general source)
  - `branding/_launch/fallback_png/fallback_1242x2688.png` (high-res)
  - `branding/_launch/fallback_png/fallback_750x1334.png`

- App icons (from Step 23):
  - `branding/_icons/png/icon_android_*.png`

## Android Integration (native project later)

For Android 12+:
1. Use SplashScreen API.
2. Set background color to black.
3. Set `windowSplashScreenAnimatedIcon` to a static bitmap (no animation here).
4. Start the real animation after app content is ready.

## Notes

- Keep splash static (system splash animation is controlled by OS).
- Runtime animation is handled by web/native layer after launch.
