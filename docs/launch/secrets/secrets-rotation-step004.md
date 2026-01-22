# Secrets Rotation & Audit — Step 4

Rules:
- No secrets are stored in the repository.
- All secrets must live in the platform secret manager / CI.
- Rotation timestamp must be recorded externally.

Checklist:
- [ ] API keys rotated
- [ ] Database credentials rotated
- [ ] OAuth / auth secrets rotated
- [ ] Webhook secrets rotated
- [ ] Old secrets revoked
- [ ] Access scopes reviewed

Evidence (external):
- Secret manager screenshots/logs
- Rotation timestamps

Notes:
- This document must never contain secret values.
