# Polaroid — Live URL (Step 101)

- UTC: 2025-12-20T20:37:49Z
- LIVE_URL: https://affiliation-hugo-texture-geek.trycloudflare.com/polaroid-mvp/index.html

## Mobile Test
1) Open on iPhone Safari:
   https://affiliation-hugo-texture-geek.trycloudflare.com/polaroid-mvp/index.html
2) Tap color → Polaroid renders → Save PNG
3) Record:
   POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh 101
   OR
   POLAROID_MOBILE_RESULT=FAIL polaroid-mvp/tools/record-mobile-result.sh 101
4) Lock:
   POLAROID_FINAL_RESULT=PASS polaroid-mvp/tools/lock-mobile-result.sh 101
   OR
   POLAROID_FINAL_RESULT=FAIL polaroid-mvp/tools/lock-mobile-result.sh 101
