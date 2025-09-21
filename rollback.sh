#!/usr/bin/env bash
set -euo pipefail

# Usage: ./rollback.sh [tag]
# If no tag is given, it rolls back to the previous Ready prod deployment.

tag="${1:-}"

if [ -z "$tag" ]; then
  # Pick the second most recent Ready prod deployment (previous good one)
  tag="$(vercel ls --prod --confirm | awk "/Ready/ {print \$1}" | sed -n "2p")"
  if [ -z "$tag" ]; then
    echo "✖ Could not determine previous deployment tag automatically."
    echo "  Try: vercel ls --prod --confirm  # then: ./rollback.sh <tag>"
    exit 1
  fi
fi

echo "• Rolling back to: $tag"
vercel rollback "$tag" --yes

# Print the current production URL after rollback
url="$(vercel ls --prod --confirm | awk "/Ready/ {print \$5}" | head -1)"
if [ -n "$url" ]; then
  echo "✅ Rolled back. Live URL: $url"
else
  echo "✅ Rolled back."
fi
