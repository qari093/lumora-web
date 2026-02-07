Launch CI Gates

Purpose
- Enforce security headers + terminal safety gates in CI.

Local commands
- pnpm -s run ci:launch-mega
- pnpm -s run ci:terminal-safety
- sh scripts/launch/run_ci_gates.sh

GitHub Actions
- Workflow: .github/workflows/launch_gates.yml
- Triggers: pull_request, push to main/master

What it checks
- Launch headers suite (Steps 53–57) in production mode (starts/stops server on :3040).
- Terminal safety gate: no-heredoc enforcement + paste-trap guard.

Artifacts (local runs)
- /tmp/step53_security_headers_core_routes.txt
- /tmp/step54_headers_regression_matrix.txt
- /tmp/step57_api_headers_regression.txt
- /tmp/launch_steps_53_57_summary.txt
