# Polaroid — Mobile Smoke Tool Self-Test (Step 100)

- UTC: 2025-12-20T20:32:57Z
- Tool: `polaroid-mvp/tools/polaroid-mobile-smoke.sh`
- Step arg: `100`
- LIVE_URL (detected):

  `https://objects-bosnia-reynolds-surgery.trycloudflare.com/polaroid-mvp/index.html`

## Output Snapshot (first 80 lines)

```
========== ▶️ POLAROID MOBILE SMOKE (TOOL) ◀️ ==========
✓ Local origin healthy (200)
LIVE_URL=https://objects-bosnia-reynolds-surgery.trycloudflare.com/polaroid-mvp/index.html

ACTION REQUIRED (DO NOW):
1) iPhone Safari open: https://objects-bosnia-reynolds-surgery.trycloudflare.com/polaroid-mvp/index.html
2) Tap color → Polaroid appears → Save PNG works
3) Record result (ONE):
   POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh 100
   POLAROID_MOBILE_RESULT=FAIL polaroid-mvp/tools/record-mobile-result.sh 100

Then lock (ONE):
   POLAROID_FINAL_RESULT=PASS polaroid-mvp/tools/lock-mobile-result.sh 100
   POLAROID_FINAL_RESULT=FAIL polaroid-mvp/tools/lock-mobile-result.sh 100

========== ▲ END POLAROID MOBILE SMOKE (TOOL) ▲ ==========
```
