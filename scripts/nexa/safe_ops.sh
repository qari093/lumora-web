. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"

# Defaults tuned for dev pressure
LOAD1_WARN="${LOAD1_WARN:-60}"
FREE_PCT_WARN="${FREE_PCT_WARN:-3}"

echo "NEXA safe ops — port ${PORT}"
echo "thresholds: load1>${LOAD1_WARN} free%<${FREE_PCT_WARN}"
echo

echo "1) perf sanity (AUTO_RELIEF=1)"
PORT="${PORT}" LOAD1_WARN="${LOAD1_WARN}" FREE_PCT_WARN="${FREE_PCT_WARN}" AUTO_RELIEF=1 sh scripts/nexa/perf_sanity.sh
echo

echo "2) ops bundle"
PORT="${PORT}" sh scripts/nexa/ops_bundle.sh
echo

echo "✅ NEXA safe ops — done"
exit 0
