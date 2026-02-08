. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

echo "Final36 Release Safety Asserts"
echo "──────────────────────────────────────────────"

# Hard fail if CI/prod-sim debug flags are accidentally enabled in real production.
# (These are allowed for tests and local prod-sim runs.)
if [ "${NODE_ENV:-}" = "production" ]; then
  bad=0
  check() {
    k="$1"
    v="${2:-}"
    if [ "${v}" = "1" ]; then
      echo "❌ ${k}=1 must not be enabled in production"
      bad=1
    fi
  }

  check "LUMORA_TEST_PROD_SIM" "${LUMORA_TEST_PROD_SIM:-0}"
  check "LUMORA_ENABLE_HEADER_CONTRACT_DEBUG" "${LUMORA_ENABLE_HEADER_CONTRACT_DEBUG:-0}"

  if [ "$bad" -ne 0 ]; then
    exit 10
  fi
fi

echo "✓ safety asserts ok"
echo "✅ release_safety_asserts — done"
