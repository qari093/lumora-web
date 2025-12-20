# Polaroid Phase-1 — Mobile Result Hardening (Step 89)

- Timestamp (UTC): 2025-12-20T20:04:56Z
- Added a guard script to prevent double-recording after a step is locked.

## Usage
```bash
POLAROID_MOBILE_STEP=86 POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh
```

If the step is already locked, the script exits non-zero and refuses to append.
