# LumaLink — Voice + Video Translation (Architecture Lock)

## Goal
Enable **real-time bidirectional translation** for voice/video calls:
- Caller A speaks **English**, Caller B hears **French** (and vice versa).
- Modes:
  - **Audio Replace** (translated audio replaces original in receiver mix)
  - **Dual Audio** (original + translated channel toggle)
  - **Live Captions** (translated captions synced to video)

## Pipeline (streaming)
1) **Capture audio frames** (WebRTC track) → PCM16 chunks (20–40ms).
2) **Streaming ASR**: PCM → partial transcripts (timestamps).
3) **Streaming MT**: transcripts → translated text (incremental).
4) **Streaming TTS**: translated text → audio chunks (voice-preserving where possible).
5) **Playout**: jitter buffer + latency guard + turn-taking controls.
6) **Captions**: align timestamps to video/call clock.

## Privacy + No-Storage (non-negotiables)
- Default: **no persistence** of raw audio, transcripts, or translations.
- Only **ephemeral memory** in-process for streaming session.
- Explicit **per-call consent** gate; feature disabled if consent not granted.
- Feature flag + kill switch.

## Providers (pluggable)
- ASR / MT / TTS are **provider adapters**.
- Default: **mock provider** (dev-safe) until keys configured.

## Tier-1 Languages (initial)
- English (en)
- German (de)
- French (fr)
- Spanish (es)
- Arabic (ar)
- **Urdu (ur)**  ✅ Tier-1
