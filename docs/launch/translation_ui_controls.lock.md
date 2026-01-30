# Translation UI Controls — LOCK (Session-level, applies to messages + voice + video)

## LEFT CONTROL — LANGUAGE
- Auto-detect toggle (default ON)
- Manual from → to when auto-detect OFF

## RIGHT CONTROL — TONE / STYLE
- Options: Formal / Neutral / Informal
- Default: Neutral
- Applies uniformly to:
  - Messages
  - Voice calls
  - Video calls
- No silent defaults beyond “Neutral”
- User always has final control

## IMPLEMENTATION STATUS
- UI: ❌ not implemented
- Hooks: ❌ not implemented
- Backend wiring: ❌ not implemented

This document locks scope only (no functionality).

## STATUS: FROZEN
- Translation UI Controls are locked and immutable.
- Any changes require explicit unfreeze step.
- Applies to messages, voice calls, and video calls uniformly.

## 🚫 HARD GUARD — TARGET SELECTION
- `components/lumalink/TranslationControlsBar.tsx` is a **provider / leaf UI component**
- It MUST NEVER be selected as a chat/composer patch target
- Composer targets must be **consumer UIs** (chat, dm, thread, inbox, message input)
- Any step selecting this file is INVALID and must be reverted immediately

## GUARD: target selection exclusions (append-only)
- Never patch anything under: app/(demo)/, app/overlay-demo/, app/_lib/admin/, app/**/admin/, app/**/auth/.
- Never patch non-UI utilities (providers, server libs) unless they render the chat composer directly.
- Allowed targets must be LumaLink chat/composer UI only.
