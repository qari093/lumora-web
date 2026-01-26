# LumaLink Translation Runtime API — LOCKED CONTRACT

Status: **LOCKED**
Scope: Messages, Voice Calls, Video Calls (uniform behavior)

## Guaranteed Runtime APIs
- TranslationSession
  - start(): Promise<void>
  - stop(): Promise<void>
  - pushAudio(buffer: Uint8Array | Buffer, tsMs?: number): Promise<void>
  - onCaptions(cb)
  - onAudio(cb)
  - onError(cb)

## Session Parameters (LOCKED)
- sessionParams.ui.language
  - autoDetect: boolean
  - from?: string
  - to: string
- sessionParams.ui.tone
  - "formal" | "neutral" | "informal"

## Invariants
- Same contract for messages, voice calls, video calls
- No silent defaults except tone="neutral"
- User always has final control
- Privacy-first (no storage unless explicitly allowed)

## Change Policy
❌ No breaking changes allowed  
❌ No silent behavior changes  
✅ Extensions require new types + explicit opt-in  

