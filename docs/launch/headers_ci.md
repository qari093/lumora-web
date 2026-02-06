# Launch Headers CI (Steps 53–57)

## What this covers
This suite verifies baseline security headers in production for:
- Core: `/`, `/wallet`, `/private-access` (Step 53 + Step 54)
- API: `/api/health`, `/api/ready`, `/api/healthz` (Step 57)

Required headers:
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

## Run
Use:
    pnpm -s run ci:launch-headers

## Artifacts
- `/tmp/step53_security_headers_core_routes.txt`
- `/tmp/step54_headers_regression_matrix.txt`
- `/tmp/step57_api_headers_regression.txt`
- `/tmp/launch_steps_53_57_summary.txt`
