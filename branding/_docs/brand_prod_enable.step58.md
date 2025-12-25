# Production Enable Flag (Step 58)

This flag controls whether the **brand splash experience** is considered production-enabled.

## File
- `branding/_flags/brand_prod_enable.step58.json`

## Default
- `enabled: false`

## Enable conditions (must be satisfied)
- Step 53 sign-off completed.
- Step 51 device matrix smoke pass performed.
- Step 52 OS coverage accepted.
- Step 57 rollback package created.

## Optional environment binding
- `LUMORA_BRAND_SPLASH_ENABLED=1`

