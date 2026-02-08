#!/usr/bin/env bash
set +e; set +u; set +o pipefail
set +H 2>/dev/null || true
. "/Users/waqarahmad/lumora-web/.lumora_safe_bootstrap.sh" >/dev/null 2>&1 || true
if [ "${1-}" = "--" ]; then shift; fi
[ "${#}" -gt 0 ] || exit 0
"$@" || true
exit 0
