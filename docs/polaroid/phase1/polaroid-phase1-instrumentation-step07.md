# Polaroid — Phase 1 Instrumentation (Step 07)

UTC: 2025-12-20T11:51:42Z

## Goal
Capture minimal, privacy-first events to validate the Phase-1 reliability loop.

## Events
- page_open
- tap_color (heuristic: element class contains color/swatch/palette)
- render_done (listen to window event: polaroid:rendered)
- save_png (listen to window event: polaroid:saved)

## Notes
- Local-first storage: localStorage key `polaroid_events_v1` (capped at 200).
- Optional best-effort beacon to `./events.ndjson` (no-op if server does not accept POST).
- Existing UI code may optionally call: `window.__lumoraPolaroidTrack('event', {meta})`.

## File touched
- polaroid-mvp/index.html
