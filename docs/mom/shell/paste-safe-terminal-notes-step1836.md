# Paste-safe Terminal Notes (Step 1836)

If your terminal shows errors like:
- `zsh: command not found: #`
- `zsh: unknown sort specifier`

It usually means you're pasting *captured transcript lines* (like `waqar@host %` prompts,
leading `#` comment lines, or wrapped fragments) instead of the actual script.

## Rule
Only paste scripts that start with:
`cat >/tmp/... <<'SH'`
and end with:
`SH`

## Paste-safe mode for current shell session
Run this in your terminal before pasting long blocks:

```bash
set -o pipefail 2>/dev/null || true
export PROMPT='' RPROMPT=''
```

Then paste only the code block content (no prompts, no `heredoc>`, no `waqar@...`).
