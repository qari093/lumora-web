# Polaroid — Paste Guard (Step 106)

- UTC: 2025-12-20T21:16:18Z

## Guardrails
- Never paste terminal prompt lines (e.g., `waqar...`, `SH-3.2$`)
- Never paste comment markers like `# OR` into the terminal
- Only paste the exact command lines given

## Repo hygiene
- Added common paste artifacts to `.gitignore`
- Removed any local stray artifacts if present
