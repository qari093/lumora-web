#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./redeploy.sh                   # deploy and tag with timestamp
#   ./redeploy.sh "fix wallet api"  # deploy and tag with timestamp + note

note="${1:-}"
ts="$(date +%Y%m%d-%H%M)"
# make a safe slug from the note
slug="$(printf "%s" "$note" | tr -cs "[:alnum:]_" "-" | tr "[:upper:]" "[:lower:]" | sed "s/^-//;s/-$//")"
tag="release-${ts}${slug:+-$slug}"

echo "• Deploying to Vercel (prod)…"
vercel --prod | tee /tmp/vercel.out

url="$(grep -Eo "https://[a-z0-9.-]+\.vercel\.app" /tmp/vercel.out | tail -1 || true)"
if [ -n "$url" ]; then
  echo "✅ Live: $url"
  printf "%s\n" "$url" > .last_deploy_url
  # auto-open on macOS if available
  command -v open >/dev/null 2>&1 && open "$url" || true
else
  echo "⚠ Deploy finished but no URL captured"
fi

# Tag current repo state for rollback convenience
if git rev-parse --git-dir >/dev/null 2>&1; then
  git tag -f "$tag" >/dev/null 2>&1 || true
  git push -f origin "$tag" >/dev/null 2>&1 || true
  echo "🏷 Tagged: $tag"
fi

echo "Done."
