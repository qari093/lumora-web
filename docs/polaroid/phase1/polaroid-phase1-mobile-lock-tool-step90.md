# Polaroid Phase-1 — Mobile Lock Tool (Step 90)

- Timestamp (UTC): 2025-12-20T20:07:05Z
- Adds a generic locker so each mobile validation step can be locked to ONE truth.

## Record then Lock
Record (example Step 86):
```bash
POLAROID_MOBILE_STEP=86 POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh
```

Lock (example Step 86):
```bash
POLAROID_MOBILE_STEP=86 POLAROID_FINAL_RESULT=PASS polaroid-mvp/tools/lock-mobile-result.sh
```

If already locked, it refuses to change the truth.
