#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"

echo "Persona CI Gate — start"

# 1) Filesystem counts (source of truth)
EMOJI_FS="$(find public/persona/emojis -maxdepth 1 -type f -name 'emoji_*.png' | wc -l | tr -d ' ')"
AVATAR_FS="$(find public/persona/avatars -type f -name 'avatar_*.png' | wc -l | tr -d ' ')"

echo "• FS counts: emojis=$EMOJI_FS avatars=$AVATAR_FS"
[ "$EMOJI_FS" -eq 480 ] || { echo "❌ Expected 480 emojis on disk"; exit 2; }
[ "$AVATAR_FS" -eq 840 ] || { echo "❌ Expected 840 avatars on disk"; exit 2; }

# 2) Manifest route sanity (best-effort if server running)
if curl -fsS "http://127.0.0.1:$PORT/api/persona/manifest" >/dev/null 2>&1; then
  TMP="/tmp/persona_manifest_ci_gate.json"
  curl -fsS "http://127.0.0.1:$PORT/api/persona/manifest" > "$TMP"
  node - <<'NODE'
const fs = require("fs");
const p = "/tmp/persona_manifest_ci_gate.json";
const j = JSON.parse(fs.readFileSync(p,"utf8"));
if (!j || j.ok !== true) throw new Error("manifest ok!=true");
const e = j.emojis?.count;
const a = j.avatars?.count;
if (e !== 480) throw new Error("manifest emojis.count != 480");
if (a !== 840) throw new Error("manifest avatars.count != 840");
console.log("✓ manifest counts OK");
NODE
else
  echo "ℹ server not reachable on :$PORT — skipping manifest HTTP check"
fi

# 3) Lock marker must exist + VERIFIED line present
[ -f ".lumora_persona_done.lock" ] || { echo "❌ Missing .lumora_persona_done.lock"; exit 3; }
grep -q "^LUMORA_PERSONA_DONE=true" .lumora_persona_done.lock || { echo "❌ Lock missing DONE=true"; exit 3; }
grep -q "^VERIFIED_AT_UTC=" .lumora_persona_done.lock || { echo "❌ Lock missing VERIFIED_AT_UTC"; exit 3; }

echo "Persona CI Gate — OK"
