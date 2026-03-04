# Vibe Tags Lite — ENV Toggle & Runtime Behavior

## ENV keys

- `LUMORA_VIBE_TAGS_LITE`
- `NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE`

Accepted truthy values: `1`, `true`, `yes`, `on` (case-insensitive)  
Accepted falsy values: `0`, `false`, `no`, `off` (case-insensitive)

Precedence:
1) `LUMORA_VIBE_TAGS_LITE`
2) `NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE`
3) internal default (flag module)

## What the toggle controls

When disabled:
- VibeTrayMount returns `null` (Video UI does not mount the tray)
- VibeWallMount returns `null` (LumaSpace does not mount the wall)
- API routes still respond safely (never 500 in dev/tests) but may report feature-disabled depending on route semantics.

When enabled:
- Video UI mounts the Vibe tray (best-effort)
- LumaSpace mounts the Vibe wall (best-effort)
- Apply route enforces `watchMs >= 5000` and per-video limits.

## Recommended defaults

Development: enable only when actively working on Vibe.
Production: keep disabled until feature flag rollout is approved.

Examples:
- Enable (dev): `LUMORA_VIBE_TAGS_LITE=1`
- Disable (prod): `LUMORA_VIBE_TAGS_LITE=0`
