. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"

echo "Final36 Operator Quickcheck"
echo "BASE=$BASE"
echo "──────────────────────────────────────────────"

need() { command -v "$1" >/dev/null 2>&1 || { echo "❌ missing required: $1"; exit 2; }; }
need curl
need sed
need tr
need head

echo "• Health"
for p in /api/health /api/healthz /api/_health /api/ready; do
  code="$(curl -sS -o /tmp/final36_qc_body.txt -w "%{http_code}" "${BASE}${p}" || true)"
  ct="$(curl -sS -I "${BASE}${p}" | tr -d '\r' | awk -F': ' 'BEGIN{IGNORECASE=1} $1=="content-type"{print $2}' | head -n1 || true)"
  echo "  ${p}  status=${code}  ct=${ct:-?}"
  if [ "$code" != "200" ]; then
    echo "    body(head): $(head -c 220 /tmp/final36_qc_body.txt 2>/dev/null || true)"
    exit 3
  fi
done
echo "✓ health ok"
echo

echo "• Portals (200 or redirect)"
for p in / /fyp /gmar /videos /nexa /movies /live; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" -L --max-redirs 3 "${BASE}${p}" || true)"
  case "$code" in
    200|301|302|303|307|308) : ;;
    *)
      echo "❌ portal ${p} unexpected status=${code}"
      exit 4
      ;;
  esac
  echo "  ${p}  status=${code}"
done
echo "✓ portals ok"
echo

echo "• Security headers (sample: /)"
HDR="/tmp/final36_qc_headers.txt"
curl -sS -D "$HDR" -o /dev/null "${BASE}/" || true
norm() { tr -d '\r' <"$HDR" | awk 'BEGIN{IGNORECASE=1} {print}'; }
geth() { norm | awk -v k="$1" -F': ' 'BEGIN{IGNORECASE=1} $1==k{print $2}' | head -n1; }

csp="$(geth "content-security-policy")"
xfo="$(geth "x-frame-options")"
rp="$(geth "referrer-policy")"
hsts="$(geth "strict-transport-security")"

[ -n "${csp:-}" ] || { echo "❌ missing CSP"; exit 5; }
[ -n "${xfo:-}" ] || { echo "❌ missing X-Frame-Options"; exit 5; }
[ -n "${rp:-}" ]  || { echo "❌ missing Referrer-Policy"; exit 5; }

echo "  CSP: ${csp%%;*}…"
echo "  XFO: ${xfo}"
echo "  RP:  ${rp}"
echo "  HSTS(dev expected empty): ${hsts:-<none>}"
echo "✓ security headers ok"
echo

echo "✅ operator_quickcheck — done"
