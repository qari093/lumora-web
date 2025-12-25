# Asset Preload Strategy (Step 36)

## Preloaded asset
- Fallback splash (static): `/branding/_launch/fallback_png/fallback_1080x1920.png`

## Strategy
- Preload the fallback splash as an image with high priority.
- SplashGate fetches `/api/brand/splash` (already) to warm timing/budget config.
- Animation frames/variants are NOT preloaded (bandwidth heavy); only used if/when runtime animation engine is enabled in later steps.

## Notes
- If your `app/layout.tsx` does not render a `<head>`, add the preload tag manually in the root layout.
