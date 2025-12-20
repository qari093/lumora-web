# Guardrail Overview (Step 571)

This document is a **human-readable guardrail overview**.  
It is **not** a shell script. Any commands belong inside fenced code blocks.

---

## 1) What the guardrails protect

Guardrails enforce:

- **Resume continuity** (expected previous step markers exist)
- **Paste hygiene** (prevents broken heredocs / stray “heredoc>” artefacts in docs)
- **Git cleanliness** (no uncommitted drift before continuing execution)
- **Deterministic progression** (step stamps + timestamps recorded)

Key files (repo root):

- `.lumora_resume_marker`
- `.lumora_paste_hygiene_checkpoint`
- `.lumora_paste_hygiene_locked`

---

## 2) Resume-marker semantics

The marker file is append-only and should include at least:

- `HEARTBEAT_STEP=<N>` and `HEARTBEAT_UTC=<ISO8601>`
- `PROGRESSION_STEP=<N>` and `PROGRESSION_UTC=<ISO8601>`

These are used as “hard prerequisites” before continuing.

---

## 3) Paste hygiene rules

Docs must not contain literal shell/terminal artefacts like:

- lines starting with `heredoc>`
- unbalanced markdown code fences

Guard scripts must fail fast if either is detected.

---

## 4) Example: Sleep GX docs hygiene verifier (reference)

If you need a verifier, keep it as a **separate executable script** (e.g. `/tmp/step_1463_verify_sleep_gx_docs.sh`)
and only embed it here as reference.

```sh
#!/bin/sh
set -euo pipefail

cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

echo "Step 1463 — Verify Sleep GX summary + docs hygiene (heredoc + code fences)"

# Locate Sleep GX summary / block document
TARGET="$(find docs/nexa-gx -type f 2>/dev/null | grep -E 'sleep.*gx.*(summary|block)' | head -n 1 || true)"

if [ -z "${TARGET:-}" ]; then
  echo "❌ No Sleep GX summary/block doc found (sleep.*gx.*(summary|block))"
  echo "• Available sleep docs:"
  find docs/nexa-gx -type f 2>/dev/null | grep -i 'sleep' | sort || true
  exit 1
fi

echo "✓ Target:"
echo "  $TARGET"
echo

echo "────────────────────────────────────────────"
echo "Preview (first 80 lines)"
echo "────────────────────────────────────────────"
sed -n '1,80p' "$TARGET" || true
echo "────────────────────────────────────────────"
echo

echo "→ Check for literal heredoc artefacts in target…"
if grep -n '^heredoc>' "$TARGET" >/dev/null 2>&1; then
  echo "❌ Found heredoc artefacts in target:"
  grep -n '^heredoc>' "$TARGET" || true
  exit 2
fi
echo "✓ No '^heredoc>' lines in target"

echo
echo "→ Check code fence balance in target…"
FENCES="$(grep -c '^```' "$TARGET" 2>/dev/null || true)"
if [ $((FENCES % 2)) -ne 0 ]; then
  echo "❌ Unbalanced code fences in target (count=$FENCES)"
  exit 3
fi
echo "✓ Code fences balanced (count=$FENCES)"

echo
echo "→ Scan docs/nexa-gx/sleep for heredoc artefacts…"
SLEEP_DIR="docs/nexa-gx/sleep"
if [ -d "$SLEEP_DIR" ]; then
  if grep -R -n '^heredoc>' "$SLEEP_DIR" >/dev/null 2>&1; then
    echo "❌ Found '^heredoc>' lines in $SLEEP_DIR:"
    grep -R -n '^heredoc>' "$SLEEP_DIR" || true
    exit 4
  fi
  echo "✓ No '^heredoc>' lines in $SLEEP_DIR"
else
  echo "ℹ No $SLEEP_DIR directory yet (ok)"
fi

echo
echo "Step 1463 — done"