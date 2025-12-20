# Polaroid MVP — Mobile Smoke Tool Step Fix (Step 97)

**UTC:** 2025-12-20T20:26:20Z

## What was fixed
The tool `polaroid-mvp/tools/polaroid-mobile-smoke.sh` now requires a numeric **STEP** argument and prints
**record/lock commands using that STEP**, preventing stale step numbers (e.g., printing 95 during Step 96).

## Usage
```bash
polaroid-mvp/tools/polaroid-mobile-smoke.sh 96
```

## Expected output
- A LIVE_URL line
- Record commands for the same step number you passed
- Lock commands for the same step number you passed
