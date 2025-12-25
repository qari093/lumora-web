# iOS Launch Screen Integration (Step 34)

This step scaffolds the **iOS Launch Screen asset mapping** for Lumora.

## Assets to use (from branding pipeline)

- Fallback splash PNGs:
  - `branding/_launch/fallback_png/fallback_1242x2688.png` (preferred high-res)
  - `branding/_launch/fallback_png/fallback_1080x1920.png`
  - `branding/_launch/fallback_png/fallback_750x1334.png`

## iOS Integration (native project later)

In Xcode:
1. Create `LaunchScreen.storyboard` (or use SwiftUI Launch Screen).
2. Set background color to black.
3. Add a centered `UIImageView` using the fallback splash PNG.
4. Constrain to safe area center; keep aspect fit.
5. Do not animate in LaunchScreen (Apple rules). Animation starts after app loads.

## Notes

- LaunchScreen must be static.
- Animation is handled in-app (web or native runtime), not in storyboard.
