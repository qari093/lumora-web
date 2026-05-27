#!/usr/bin/env bash
set -euo pipefail

cat <<'PLAN'
FYP94 R2 migration prep:

1. Create Cloudflare R2 bucket.
2. Upload public/native-fyp/real/*.mp4 to bucket path /native-fyp/real/.
3. Set CDN/domain mapping.
4. Set env:
   FYP94_STORAGE_MODE=r2
   FYP94_CDN_BASE_URL=https://cdn.your-domain.com
5. Keep local fallback active if CDN env is missing.
PLAN
